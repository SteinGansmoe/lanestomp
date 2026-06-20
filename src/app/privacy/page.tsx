import Link from "next/link";
import type { Metadata } from "next";

import { LegalPageShell } from "@/src/components/legal-page-shell";

const lastUpdated = "June 4, 2026";

export const metadata: Metadata = {
  alternates: {
    canonical: "/privacy",
  },
  title: "Privacy Policy",
  description:
    "Privacy Policy for LaneStomp, covering accounts, analytics, cookies, feedback, third-party services, and user rights.",
};

const privacySections = [
  {
    title: "Information We Collect",
    body: (
      <>
        <p>
          LaneStomp collects the information needed to run a League of Legends matchup learning
          product. This may include your account email address, authentication identifiers, username
          or profile preferences, saved settings, and actions you take while using account-based
          features.
        </p>
        <p>
          We may also process gameplay preferences you choose in the product, such as selected
          champions, lanes, matchup choices, feedback on matchup cards, and admin-generated content
          states.
        </p>
      </>
    ),
  },
  {
    title: "How We Use Information",
    body: (
      <>
        <p>
          We use information to provide account access, show the right LaneStomp features, improve
          matchup guidance, review feedback, maintain security, troubleshoot errors, and understand
          which parts of the product are useful.
        </p>
        <p>
          LaneStomp does not sell personal information. If premium features, advertising, or
          additional integrations are introduced later, this policy will be updated before those
          uses become active.
        </p>
      </>
    ),
  },
  {
    title: "Accounts and Email Addresses",
    body: (
      <p>
        User accounts are used to identify your session and make account features possible. Email
        addresses may be used for sign-in, account confirmation, password recovery, security
        notices, and important service updates. We do not use your email address to send unrelated
        marketing without an appropriate consent or unsubscribe path.
      </p>
    ),
  },
  {
    title: "User Preferences",
    body: (
      <p>
        Preferences such as username, selected game context, champion pool choices, interface
        settings, and learning workflows may be stored so the service feels consistent when you
        return. Some interface preferences may be stored locally in your browser.
      </p>
    ),
  },
  {
    title: "Google Analytics",
    body: (
      <p>
        LaneStomp uses Google Analytics to understand aggregate product usage, such as page visits,
        navigation patterns, and feature engagement. This helps prioritize improvements. Google
        Analytics may use cookies or similar technologies according to Google&apos;s own policies
        and controls.
      </p>
    ),
  },
  {
    title: "Cookies and Local Storage",
    body: (
      <p>
        LaneStomp and its providers may use cookies, local storage, or similar browser storage for
        authentication, security, analytics, interface preferences, and product functionality.
        Disabling cookies may prevent account features from working correctly.
      </p>
    ),
  },
  {
    title: "Feedback Submissions",
    body: (
      <p>
        When you submit matchup feedback, LaneStomp may store the reported champion matchup, lane,
        card type, reason, message, status, and related account identifier if you are signed in.
        Feedback is used to improve generated guidance and review content quality.
      </p>
    ),
  },
  {
    title: "Third-Party Services",
    body: (
      <>
        <p>LaneStomp relies on third-party services to operate:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-zinc-100">Supabase</strong> provides authentication, database,
            and account infrastructure.
          </li>
          <li>
            <strong className="text-zinc-100">OpenAI</strong> may process admin-requested matchup
            generation prompts and related structured content needed to produce draft guidance.
          </li>
          <li>
            <strong className="text-zinc-100">Vercel</strong> hosts and serves the application and
            may process operational request data.
          </li>
          <li>
            <strong className="text-zinc-100">Google Analytics</strong> provides analytics about
            product usage and performance.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Data Retention",
    body: (
      <p>
        LaneStomp keeps account, preference, feedback, and operational records for as long as needed
        to provide the service, maintain security, improve the product, resolve disputes, and
        satisfy legal or operational needs. Data may be deleted or anonymized when it is no longer
        needed.
      </p>
    ),
  },
  {
    title: "Security",
    body: (
      <p>
        LaneStomp uses reasonable technical and organizational measures for an early-stage product,
        including managed authentication, access controls, and provider security features. No online
        service can guarantee perfect security, so users should protect their account credentials
        and report suspicious activity.
      </p>
    ),
  },
  {
    title: "Future Advertising Support",
    body: (
      <p>
        LaneStomp may add advertising or sponsorship support in the future, including services such
        as Google AdSense. If that happens, advertising partners may use cookies or similar
        technologies, and this policy will be updated to explain the active advertising practices
        and choices.
      </p>
    ),
  },
  {
    title: "Your Rights",
    body: (
      <p>
        Depending on where you live, you may have rights to access, correct, delete, restrict, or
        object to certain processing of your personal information. You may also request information
        about the data associated with your account.
      </p>
    ),
  },
  {
    title: "Contact",
    body: (
      <p>
        For privacy questions, account data requests, or security concerns, contact LaneStomp
        through the public project repository at{" "}
        <Link
          className="text-cyan-200 underline-offset-4 hover:underline"
          href="https://github.com/SteinGansmoe/lanestomp"
        >
          github.com/SteinGansmoe/lanestomp
        </Link>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageShell
      description="How LaneStomp handles account data, product usage signals, analytics, feedback submissions, and third-party services."
      lastUpdated={lastUpdated}
      sections={privacySections}
      title="Privacy Policy"
    />
  );
}
