import {
  matchupDraftSectionKeys,
  type MatchupDraftSectionKey,
} from "./matchup-draft-prompt";

type MatchupFallbackContaminationPattern = {
  label: string;
  pattern: RegExp;
};

export type MatchupFallbackContaminationMatch = {
  label: string;
  sample: string;
  sectionKey: MatchupDraftSectionKey;
};

export type MatchupFallbackContaminationResult = {
  affectedSections: MatchupDraftSectionKey[];
  hasFallbackContent: boolean;
  matches: MatchupFallbackContaminationMatch[];
  phraseCount: number;
};

export type MatchupDraftContentLike = Partial<
  Record<MatchupDraftSectionKey, string | null | undefined>
>;

const fallbackContaminationPatterns: readonly MatchupFallbackContaminationPattern[] =
  [
    {
      label: "old overview review placeholder",
      pattern: /\breview the non-obvious\b/i,
    },
    {
      label: "old broad notes placeholder",
      pattern: /\bkeep broad notes out of this section\b/i,
    },
    {
      label: "old list-only placeholder",
      pattern: /\blist only real level\b/i,
    },
    {
      label: "old verified spike placeholder",
      pattern: /\bverified (?:jungle fight|spike|cooldown|ability)/i,
    },
    {
      label: "old re-check power spike placeholder",
      pattern: /\bre-?check river fights after first recall\b/i,
    },
    {
      label: "old generic cross-map placeholder",
      pattern: /\buse cross-map trades when direct river fights are not favorable\b/i,
    },
    {
      label: "current jungle overview placeholder",
      pattern: /\bneeds a controlled jungle plan that weighs invade\b/i,
    },
    {
      label: "current jungle pathing placeholder",
      pattern: /\bplay early pathing around lane priority\b/i,
    },
    {
      label: "current jungle tracking placeholder",
      pattern: /\bsetup by tracking camps and trading sides when direct fights are bad\b/i,
    },
    {
      label: "current jungle scuttle placeholder",
      pattern:
        /\bfirst clear should set up river control only when the first scuttle is actually contestable\b/i,
    },
    {
      label: "current jungle invade placeholder",
      pattern: /\binvade .+ only when nearby lanes can move\b/i,
    },
    {
      label: "current jungle tempo placeholder",
      pattern: /\btempo leads matter most when they become void grubs\b/i,
    },
    {
      label: "current jungle danger placeholder",
      pattern:
        /\bstrongest invade, river, or objective timing makes blind fog checks dangerous\b/i,
    },
    {
      label: "current jungle caution placeholder",
      pattern:
        /\bmissing lane priority around scuttle, dragon, void grubs, or herald turns river contests\b/i,
    },
    {
      label: "current jungle early clear placeholder",
      pattern:
        /\bfirst clear should path toward lanes that can move before the enemy jungler's level 3 threat\b/i,
    },
    {
      label: "current jungle first river placeholder",
      pattern: /\bpath .+ toward the first river move only when nearby lanes can collapse first\b/i,
    },
    {
      label: "current jungle cross-map placeholder",
      pattern: /\bcross-map camps or gank opposite side instead of flipping a bad scuttle fight\b/i,
    },
    {
      label: "current jungle level 6 placeholder",
      pattern: /\blevel 6 usually adds enough threat to make isolated river\b/i,
    },
    {
      label: "current jungle first item placeholder",
      pattern: /\bfirst completed item improves clear tempo and durability\b/i,
    },
    {
      label: "current jungle two-item placeholder",
      pattern: /\btwo completed items make .+ more reliable in front-to-back objective fights\b/i,
    },
    {
      label: "current jungle objective placeholder",
      pattern: /\bjungle tempo into objective access and repeatable gank pressure\b/i,
    },
    {
      label: "current jungle denial placeholder",
      pattern: /\bthe clears, objective setups, or scaling windows that let them play on their terms\b/i,
    },
    {
      label: "current dragon fight placeholder",
      pattern:
        /\bif you have a numbers disadvantage, trade the tempo window into top-side camps\b/i,
    },
    {
      label: "current lane overview placeholder",
      pattern: /\blane plan depends on whether pressure, free-farm denial\b/i,
    },
    {
      label: "current lane danger placeholder",
      pattern: /\bjungle fog and missing summoners make extended lane pressure much riskier\b/i,
    },
    {
      label: "current lane power spike placeholder",
      pattern: /\blevel 6 or first completed item can turn short trades into lethal\b/i,
    },
    {
      label: "current lane two-item placeholder",
      pattern: /\btwo completed items make .+ lane pressure matter more in objective fights\b/i,
    },
  ];

export function scanMatchupDraftForFallbackContent(
  draft: MatchupDraftContentLike
): MatchupFallbackContaminationResult {
  const matches: MatchupFallbackContaminationMatch[] = [];

  for (const sectionKey of matchupDraftSectionKeys) {
    const section = draft[sectionKey]?.trim();

    if (!section) {
      continue;
    }

    for (const { label, pattern } of fallbackContaminationPatterns) {
      if (!pattern.test(section)) {
        continue;
      }

      matches.push({
        label,
        sample: getFallbackContaminationSample(section, pattern),
        sectionKey,
      });
    }
  }

  const affectedSections = Array.from(
    new Set(matches.map((match) => match.sectionKey))
  );

  return {
    affectedSections,
    hasFallbackContent: matches.length > 0,
    matches,
    phraseCount: matches.length,
  };
}

function getFallbackContaminationSample(section: string, pattern: RegExp) {
  const matchingLine =
    section.split("\n").find((line) => pattern.test(line)) ?? section;

  return matchingLine.trim().slice(0, 180);
}
