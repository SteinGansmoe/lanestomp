import Link from "next/link";
import type { Metadata } from "next";

import { LegalPageShell } from "@/src/components/legal-page-shell";

const lastUpdated = "June 4, 2026";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of Use for LaneStomp, covering service usage, accounts, content accuracy, availability, intellectual property, and liability limits.",
};

const termsSections = [
  {
    title: "Using LaneStomp",
    body: (
      <p>
        LaneStomp is a League of Legends learning and matchup preparation platform. You may use it
        to study matchup guidance, compare champion choices, submit feedback, and improve champion
        pool decisions. You agree to use the service lawfully and respectfully.
      </p>
    ),
  },
  {
    title: "User Responsibilities",
    body: (
      <p>
        You are responsible for the activity that happens through your account, for keeping your
        credentials secure, and for making sure anything you submit does not violate laws,
        third-party rights, or the integrity of the service. Do not attempt to abuse, overload,
        scrape, reverse engineer, or interfere with LaneStomp systems.
      </p>
    ),
  },
  {
    title: "Account Ownership",
    body: (
      <p>
        You keep ownership of your account information and feedback submissions. By submitting
        feedback or preferences, you allow LaneStomp to store, review, display internally, and use
        that information to operate and improve the product.
      </p>
    ),
  },
  {
    title: "Matchup Content and Accuracy",
    body: (
      <p>
        LaneStomp matchup guidance is educational support, not guaranteed game advice. League
        patches, champion balance, rank, team compositions, player skill, and in-game decisions can
        change what is correct. AI assisted drafts and admin-reviewed notes may still contain
        mistakes or become outdated.
      </p>
    ),
  },
  {
    title: "Availability",
    body: (
      <p>
        LaneStomp is an early-stage product and may change, pause, break, or be unavailable at
        times. Features may be added, removed, limited, or reset as the product evolves, including
        matchup generation, account features, premium tools, analytics, feedback workflows, or
        content libraries.
      </p>
    ),
  },
  {
    title: "Future Features and Paid Services",
    body: (
      <p>
        LaneStomp may introduce premium features, advertising, sponsorships, or other product
        changes in the future. Additional terms may apply to those features when they launch.
      </p>
    ),
  },
  {
    title: "Account Termination",
    body: (
      <p>
        LaneStomp may suspend or terminate accounts, remove content, or restrict access when needed
        to protect users, enforce these terms, respond to abuse, comply with legal requirements, or
        maintain the service.
      </p>
    ),
  },
  {
    title: "Intellectual Property",
    body: (
      <p>
        LaneStomp owns or licenses the application design, code, branding, generated layouts, and
        original product content. League of Legends, Riot Games, champion names, game assets, and
        related marks belong to their respective owners. See the{" "}
        <Link className="text-cyan-200 underline-offset-4 hover:underline" href="/legal">
          Legal & Disclaimer
        </Link>{" "}
        page for additional notices.
      </p>
    ),
  },
  {
    title: "Limitation of Liability",
    body: (
      <p>
        To the fullest extent allowed by law, LaneStomp is provided as is and as available.
        LaneStomp is not liable for lost rank, gameplay outcomes, missed opportunities, service
        interruptions, data loss, indirect damages, or reliance on matchup guidance.
      </p>
    ),
  },
  {
    title: "Contact",
    body: (
      <p>
        For questions regarding these terms, please contact LaneStomp through the available support
        channels. Additional contact options may be introduced as the platform grows.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPageShell
      description="The baseline terms for using LaneStomp as an early-stage League matchup learning and improvement platform."
      lastUpdated={lastUpdated}
      sections={termsSections}
      title="Terms of Use"
    />
  );
}
