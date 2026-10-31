import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
function loadTs(path, overrides = {}) {
  const source = readFileSync(path, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const exports = {};
  vm.runInNewContext(
    compiled,
    {
      exports,
      require: (id) => (id in overrides ? overrides[id] : require(id)),
    },
    { filename: path },
  );
  return exports;
}
const helpers = loadTs("src/features/league/matchup-feedback.ts");
const { canSubmitMatchupFeedback, prepareFeedbackMessage } = helpers;
for (const status of ["draft", "failed", "unpublished", null, undefined])
  assert.equal(canSubmitMatchupFeedback({ id: 1, generation_status: status }), false);
assert.equal(canSubmitMatchupFeedback(null), false);
assert.equal(canSubmitMatchupFeedback({ generation_status: "reviewed" }), false);
assert.equal(canSubmitMatchupFeedback({ id: 1, generation_status: "reviewed" }), true);

// Exercise the real component's elements and async handlers with local state and
// an RPC stub. No browser session, environment credentials or network is used.
const state = [];
let cursor = 0;
let calls = [];
let rejection = null;
let throwNetworkError = false;
const component = loadTs("src/components/league/matchup-feedback-controls.tsx", {
  react: {
    useEffect() {},
    useId: () => "feedback-help",
    useState(initial) {
      const index = cursor++;
      if (!(index in state)) state[index] = initial;
      return [
        state[index],
        (value) => {
          state[index] = typeof value === "function" ? value(state[index]) : value;
        },
      ];
    },
  },
  "@/src/components/ui/button": { Button: "button" },
  "@/src/features/league/matchup-feedback": helpers,
  "@/src/lib/supabase": {
    supabase: {
      rpc: async (name, args) => {
        calls.push({ name, args });
        if (throwNetworkError) throw new Error("synthetic internal network details");
        return { error: rejection, data: [{ helpful_count: 1, not_helpful_count: 0 }] };
      },
    },
  },
});
function render() {
  cursor = 0;
  return component.MatchupFeedbackControls({
    cardType: "overview",
    matchupId: 1,
    lane: "mid",
    playerChampion: "Ahri",
    enemyChampion: "Annie",
  });
}
function elements(node, result = []) {
  if (Array.isArray(node)) {
    for (const child of node) elements(child, result);
  } else if (node && typeof node === "object" && node.props) {
    result.push(node);
    elements(node.props.children, result);
  }
  return result;
}
const text = (node) =>
  Array.isArray(node)
    ? node.map(text).join("")
    : node?.props
      ? text(node.props.children)
      : typeof node === "string" || typeof node === "number"
        ? String(node)
        : "";
const get = (type, label) =>
  elements(render()).find((e) => e.type === type && (!label || text(e).includes(label)));
async function openReport(message) {
  get("button", "Report").props.onClick();
  get("textarea").props.onChange({ target: { value: message } });
}
function reset() {
  state.length = 0;
  calls = [];
  rejection = null;
  throwNetworkError = false;
}

for (const valid of [
  "x".repeat(4000),
  "😀".repeat(4000),
  " \t\n" + "x".repeat(4000) + "\u00a0",
  "e\u0301".repeat(2000),
]) {
  reset();
  await openReport(valid);
  assert.equal(prepareFeedbackMessage(valid).length, 4000);
  assert.equal(
    get("textarea").props.maxLength,
    8000,
    "Native UTF-16 ceiling accommodates 4,000 emoji",
  );
  assert.equal(get("textarea").props["aria-describedby"], "feedback-help");
  assert.ok(text(render()).includes("4,000 / 4,000"));
  assert.equal(get("button", "Submit report").props.disabled, false);
  await get("button", "Submit report").props.onClick();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].name, "submit_matchup_feedback");
  assert.equal(calls[0].args.p_message, valid.trim());
  assert.equal(calls[0].args.p_feedback_type, "report_issue");
  assert.ok(text(render()).includes("Issue reported"));
}
for (const invalid of ["x".repeat(4001), "😀".repeat(4001)]) {
  reset();
  await openReport(invalid);
  assert.equal(get("textarea").props["aria-invalid"], true);
  for (const label of ["Helpful", "Not helpful", "Submit report"])
    assert.equal(get("button", label).props.disabled, true);
  // Invoke the handler anyway to check the guard independently of disabled UI.
  await get("button", "Submit report").props.onClick();
  assert.equal(calls.length, 0);
  assert.ok(text(get("p")).includes("shorten"));
}
for (const label of ["Helpful", "Not helpful"]) {
  reset();
  await get("button", label).props.onClick();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].args.p_message, null);
  assert.equal(calls[0].args.p_reason, null);
  assert.ok(text(render()).includes("Feedback saved"));
}
reset();
await openReport(" \t\n ");
await get("button", "Submit report").props.onClick();
assert.equal(calls[0].args.p_message, null);
for (const message of [
  "Feedback message must be at most 4000 characters.",
  "A reviewed matchup with the specified lane is required.",
  "synthetic private database details",
]) {
  reset();
  rejection = { code: "P0001", message };
  await openReport("valid");
  await get("button", "Submit report").props.onClick();
  const alert = elements(render()).find((e) => e.props.role === "alert");
  assert.ok(alert);
  assert.ok(!text(alert).includes("synthetic private"));
  assert.equal(get("textarea").props.value, "valid", "Failed requests preserve the message");
}
reset();
throwNetworkError = true;
await get("button", "Helpful").props.onClick();
assert.ok(text(render()).includes("couldn't save"));
assert.equal(get("button", "Helpful").props.disabled, false);

const panel = readFileSync("src/components/league/league-matchup-review-panel.tsx", "utf8");
assert.match(panel, /canSubmitMatchupFeedback\(displayMatchup\) && displayMatchup\?\.id/);
assert.match(panel, /!isEditing && feedbackContext/);
for (const action of ["Admin review", "Edit guidance", "Mark reviewed", "Regenerate"])
  assert.ok(panel.includes(action));
console.log(
  "PASS: publication gating, Unicode/whitespace message boundaries, votes/reports, oversized submission guard and friendly errors (mocked component handlers).",
);
