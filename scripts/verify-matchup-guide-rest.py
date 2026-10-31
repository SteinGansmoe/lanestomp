"""Read-only REST verification. Credentials remain in memory; no response logging."""

import base64
import getpass
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import warnings


warnings.simplefilter("error", getpass.GetPassWarning)

# Never echo a server-supplied code unless it is on this fixed allowlist.
SAFE_CODES = frozenset({
    "42501", "42703", "42P01", "PGRST100", "PGRST200", "PGRST204",
    "PGRST205", "PGRST301", "PGRST302", "PGRST303", "bad_jwt",
    "jwt_expired", "invalid_jwt", "invalid_api_key",
})
AUTH_CODES = frozenset({
    "PGRST301", "PGRST302", "PGRST303", "bad_jwt", "jwt_expired",
    "invalid_jwt", "invalid_api_key",
})


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def claims(value):
    """Decode locally for input checks only; this does NOT verify a signature."""
    parts = value.split(".")
    if len(parts) != 3:
        raise ValueError()
    payload = parts[1] + "=" * (-len(parts[1]) % 4)
    result = json.loads(base64.urlsafe_b64decode(payload))
    if not isinstance(result, dict):
        raise ValueError()
    return result


def token_problem(token):
    if token.lower().startswith("bearer "):
        return "INPUT_ERROR_TOKEN_INCLUDES_BEARER_PREFIX"
    try:
        payload = claims(token)
        if payload.get("role") != "authenticated" or not payload.get("sub"):
            return "INPUT_ERROR_EXPECTED_USER_ACCESS_JWT"
        expiry = payload.get("exp")
        if not isinstance(expiry, (int, float)) or isinstance(expiry, bool):
            return "INPUT_ERROR_JWT_EXPIRY_MISSING"
        if expiry <= time.time():
            return "AUTHENTICATION_INPUT_JWT_EXPIRED"
    except Exception:
        return "INPUT_ERROR_MALFORMED_ACCESS_JWT"
    return None


def request(opener, base, key, token, relation, query):
    headers = {"apikey": key, "Accept": "application/json"}
    if token:
        headers["Authorization"] = "Bearer " + token
    url = base + "/rest/v1/" + relation + "?" + urllib.parse.urlencode(query)
    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        try:
            response = opener.open(req, timeout=30)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            status = response.code
            raw = response.read(65537)
    except Exception:
        return None, None, "NETWORK_ERROR"
    if len(raw) > 65536:
        return status, None, "RESPONSE_TOO_LARGE"
    try:
        return status, json.loads(raw), None
    except Exception:
        return status, None, "NON_JSON_RESPONSE"


def classify(kind, authenticated, status, body, problem):
    code = body.get("code") if isinstance(body, dict) else None
    # Anonymous storage denial is expected, rather than an auth failure.
    if (kind == "storage" and not authenticated and status in (401, 403)
            and code == "42501"):
        return "PASS"
    if isinstance(code, str) and code in AUTH_CODES:
        return "AUTHENTICATION_REJECTED"
    if status in (401, 403):
        if kind == "storage" and authenticated:
            return "EXPECTATION_MISMATCH_STORAGE_DENIED_NO_DISCLOSURE"
        return "AUTHENTICATION_OR_PERMISSION_DENIED"
    if problem:
        return problem
    if kind == "private":
        if status == 400 and code == "42703":
            return "PASS"
        if status == 200:
            return "ACCESS_CONTROL_FINDING_PRIVATE_COLUMN_ACCEPTED"
        return "TEST_ASSERTION_UNEXPECTED_COLUMN_RESPONSE"
    if status != 200:
        return "TEST_ASSERTION_UNEXPECTED_HTTP_STATUS"
    if not isinstance(body, list):
        return "TEST_ASSERTION_EXPECTED_ARRAY"
    if kind == "reviewed":
        if not body:
            return "TEST_ASSERTION_EMPTY_REVIEWED_SAMPLE"
        if len(body) != 1 or not isinstance(body[0], dict):
            return "TEST_ASSERTION_UNEXPECTED_SAMPLE_SHAPE"
        if "generation_status" not in body[0]:
            return "TEST_ASSERTION_MISSING_GENERATION_STATUS"
        if body[0]["generation_status"] != "reviewed":
            return "ACCESS_CONTROL_FINDING_NON_REVIEWED_ROW"
        return "PASS"
    if kind == "filtered":
        return "PASS" if body == [] else "ACCESS_CONTROL_FINDING_FILTERED_ROWS"
    if kind == "storage":
        if body:
            return "ACCESS_CONTROL_FINDING_STORAGE_ROWS_CONFIRM_NON_ADMIN_IDENTITY"
        return "PASS" if authenticated else "EXPECTATION_MISMATCH_ANONYMOUS_EMPTY_STORAGE"
    return "TEST_ASSERTION_UNKNOWN_CHECK"


def run():
    base = input("Owner-verified Supabase HTTPS origin: ").strip().rstrip("/")
    origin = urllib.parse.urlsplit(base)
    if not (origin.scheme == "https" and origin.hostname
            and not origin.username and not origin.password
            and origin.path in ("", "/") and not origin.query and not origin.fragment):
        print("setup: INPUT_ERROR_HTTPS_ORIGIN_REQUIRED")
        return 2
    key = getpass.getpass("Publishable or legacy anon key (hidden): ").strip()
    try:
        public_key = key.startswith("sb_publishable_") or claims(key).get("role") == "anon"
    except Exception:
        public_key = False
    if not public_key:
        print("setup: INPUT_ERROR_PUBLIC_KEY_REQUIRED")
        return 2
    print("Use an existing user independently confirmed to be non-admin.")
    token = getpass.getpass("User access JWT only, without Bearer (hidden; blank to skip): ").strip()
    problem = token_problem(token) if token else "MISSING_USER_TOKEN"
    opener = urllib.request.build_opener(NoRedirect())
    checks = [
        ("reviewed", "reviewed", "public_league_matchups",
         {"select": "id,generation_status", "limit": "1"}),
        ("draft", "filtered", "public_league_matchups",
         {"select": "id", "generation_status": "eq.draft", "limit": "1"}),
        ("failed", "filtered", "public_league_matchups",
         {"select": "id", "generation_status": "eq.failed", "limit": "1"}),
        ("admin_notes", "private", "public_league_matchups",
         {"select": "admin_notes", "limit": "0"}),
        ("reviewed_by", "private", "public_league_matchups",
         {"select": "reviewed_by", "limit": "0"}),
        ("original_table", "storage", "league_matchups", {"select": "id", "limit": "1"}),
    ]
    results = []
    for identity, jwt in (("anonymous", None), ("authenticated", token)):
        if identity == "authenticated" and problem:
            print("authenticated/setup: " + problem + " HTTP=- code=-")
            continue
        for label, kind, relation, query in checks:
            status, body, response_problem = request(opener, base, key, jwt, relation, query)
            result = classify(kind, jwt is not None, status, body, response_problem)
            code = body.get("code") if isinstance(body, dict) else None
            safe_code = code if isinstance(code, str) and code in SAFE_CODES else "-"
            print(identity + "/" + label + ": " + result
                  + " HTTP=" + (str(status) if status is not None else "-")
                  + " code=" + safe_code)
            results.append(result)
    if not problem and all(result == "PASS" for result in results):
        print("summary: PASS_FOR_OWNER_CONFIRMED_NON_ADMIN_IDENTITY")
        return 0
    print("summary: INCOMPLETE_OR_REVIEW_REQUIRED_SEE_LABELED_CHECKS")
    return 1


if __name__ == "__main__":
    try:
        sys.exit(run())
    except (KeyboardInterrupt, EOFError):
        print("setup: INPUT_CANCELLED HTTP=- code=-")
        sys.exit(2)
    except getpass.GetPassWarning:
        print("setup: HIDDEN_INPUT_UNAVAILABLE HTTP=- code=-")
        sys.exit(2)
    except Exception:
        # Never print exception text, traceback, request objects or response bodies.
        print("verifier: LOCAL_VERIFIER_ERROR HTTP=- code=-")
        sys.exit(2)
