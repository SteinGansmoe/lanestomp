import type { Metadata } from "next";

import { LegalPageShell } from "@/src/components/legal-page-shell";

const lastUpdated = "June 4, 2026";

export const metadata: Metadata = {
  title: "Legal & Disclaimer",
  description:
    "Legal notices, Riot Games disclaimer, trademark acknowledgements, Data Dragon asset notice, and third-party content notices for LaneStomp.",
};

const legalSections = [
  {
    title: "Riot Games Disclaimer",
    body: (
      <p>
        LaneStomp is not endorsed by Riot Games and does not reflect the views or opinions of Riot
        Games or anyone officially involved in producing or managing Riot Games properties. Riot
        Games and all associated properties are trademarks or registered trademarks of Riot Games,
        Inc.
      </p>
    ),
  },
  {
    title: "Trademark Acknowledgement",
    body: (
      <p>
        League of Legends, Riot Games, champion names, icons, splash art, game assets, marks, logos,
        and related properties belong to Riot Games, Inc. LaneStomp uses these references only to
        identify game content and help players learn matchups.
      </p>
    ),
  },
  {
    title: "Data Dragon Asset Usage",
    body: (
      <p>
        LaneStomp may use League of Legends champion data, champion images, role icons, and related
        static assets made available through Riot Games Data Dragon or related public resources.
        Those assets remain the property of Riot Games and are used for informational and gameplay
        reference purposes.
      </p>
    ),
  },
  {
    title: "Third-Party Content Notice",
    body: (
      <p>
        LaneStomp may link to or reference third-party services, communities, game resources,
        analytics providers, infrastructure providers, and AI tooling. LaneStomp is not responsible
        for third-party content, policies, availability, or changes outside its control.
      </p>
    ),
  },
  {
    title: "Generated Guidance Notice",
    body: (
      <p>
        Some matchup drafts may be AI-assisted and then reviewed or edited by admins. Generated or
        reviewed guidance is intended for learning support and may become outdated as League of
        Legends changes. Players should use their own judgment in game.
      </p>
    ),
  },
  {
    title: "General Legal Notices",
    body: (
      <p>
        LaneStomp is an independent product created for League players. Nothing on LaneStomp creates
        an endorsement, sponsorship, partnership, or agency relationship with Riot Games or other
        third-party providers unless explicitly stated in writing.
      </p>
    ),
  },
];

export default function LegalPage() {
  return (
    <LegalPageShell
      description="Riot Games disclaimers, trademark acknowledgements, Data Dragon asset usage notes, and general legal notices for LaneStomp."
      lastUpdated={lastUpdated}
      sections={legalSections}
      title="Legal & Disclaimer"
    />
  );
}
