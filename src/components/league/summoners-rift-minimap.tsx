import type { LeagueRole } from "@/src/features/league/roles";
import { cn } from "@/src/lib/utils";

type SummonersRiftMinimapProps = {
  className?: string;
  role: LeagueRole;
};

export function SummonersRiftMinimap({ className, role }: SummonersRiftMinimapProps) {
  const isTop = role === "top";
  const isMid = role === "mid";
  const isJungle = role === "jungle";
  const isBot = role === "adc" || role === "support";
  const isSupport = role === "support";
  const glowId = `rift-lane-glow-${role}`;
  const junglePathGradientId = `rift-jungle-path-${role}`;
  const activeStroke = isSupport ? "#f3c969" : "#67e8f9";
  const activeSoftStroke = isSupport ? "#d6b45d" : "#38bdf8";
  const blueSideStroke = "#67e8f9";
  const redSideStroke = "#fb7185";
  const redSideSoftStroke = "#fda4af";
  const activeClassName = "opacity-100";
  const inactiveClassName = "opacity-25";

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[13.5rem] rounded-lg border border-cyan-300/15 bg-[#07101f] p-3 shadow-xl shadow-black/25",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-md border border-white/10 bg-[#081120]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-70 saturate-[0.85]"
          style={{ backgroundImage: "url('/images/summoners-rift.jpeg')" }}
        />
        <div className="absolute inset-0 bg-[#050b18]/35 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(103,232,249,0.14),transparent_58%)]" />
        <svg
          aria-label={`${getRoleLabel(role)} lane minimap indicator`}
          className="absolute inset-0 h-full w-full overflow-visible"
          role="img"
          viewBox="0 0 100 100"
        >
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              height="180%"
              id={glowId}
              width="180%"
              x="-40%"
              y="-40%"
            >
              <feGaussianBlur stdDeviation="2.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id={junglePathGradientId}
              x1="50"
              x2="50"
              y1="24"
              y2="76"
            >
              <stop offset="0%" stopColor={redSideSoftStroke} />
              <stop offset="45%" stopColor={redSideStroke} />
              <stop offset="55%" stopColor={blueSideStroke} />
              <stop offset="100%" stopColor={activeSoftStroke} />
            </linearGradient>
          </defs>

          <rect className="stroke-white/15" fill="none" height="94" rx="8" width="94" x="3" y="3" />
          <path
            d="M11 84 L11 29 C11 19 19 11 29 11 L86 11"
            fill="none"
            stroke="#0f172a"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5"
          />
          <path
            d="M14 86 L86 14"
            fill="none"
            stroke="#0f172a"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <path
            d="M14 89 L71 89 C81 89 89 81 89 71 L89 14"
            fill="none"
            stroke="#0f172a"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5"
          />

          <path
            className={isTop ? activeClassName : inactiveClassName}
            d="M11 84 L11 29 C11 19 19 11 29 11 L86 11"
            fill="none"
            filter={isTop ? `url(#${glowId})` : undefined}
            stroke={isTop ? activeStroke : "#94a3b8"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isTop ? 5.5 : 2.2}
          />
          <path
            className={isMid ? activeClassName : inactiveClassName}
            d="M14 86 L86 14"
            fill="none"
            filter={isMid ? `url(#${glowId})` : undefined}
            stroke={isMid ? activeStroke : "#94a3b8"}
            strokeLinecap="round"
            strokeWidth={isMid ? 5.5 : 2.2}
          />
          <path
            className={isBot ? activeClassName : inactiveClassName}
            d="M14 89 L71 89 C81 89 89 81 89 71 L89 14"
            fill="none"
            filter={isBot ? `url(#${glowId})` : undefined}
            stroke={isBot ? activeStroke : "#94a3b8"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isBot ? 5.5 : 2.2}
          />

          <g
            className={isJungle ? activeClassName : inactiveClassName}
            filter={isJungle ? `url(#${glowId})` : undefined}
          >
            <path
              d="M25 68 C28 52 36 40 48 32"
              fill="none"
              stroke={isJungle ? `url(#${junglePathGradientId})` : "#94a3b8"}
              strokeLinecap="round"
              strokeWidth={isJungle ? 4.5 : 2}
            />
            <path
              d="M52 68 C63 59 70 48 75 32"
              fill="none"
              stroke={isJungle ? `url(#${junglePathGradientId})` : "#94a3b8"}
              strokeLinecap="round"
              strokeWidth={isJungle ? 4.5 : 2}
            />
            {[
              { cx: 28, cy: 54 },
              { cx: 40, cy: 40 },
              { cx: 61, cy: 52 },
              { cx: 72, cy: 65 },
            ].map((marker) => (
              <circle
                cx={marker.cx}
                cy={marker.cy}
                fill={isJungle ? (marker.cy < 50 ? redSideStroke : blueSideStroke) : "#94a3b8"}
                key={`${marker.cx}-${marker.cy}`}
                r={isJungle ? 3.2 : 2}
              />
            ))}
          </g>

          {isSupport ? (
            <g filter={`url(#${glowId})`}>
              <circle cx="72" cy="82" fill="#f8e7a1" r="3.5" />
              <circle cx="84" cy="67" fill="#f3c969" r="2.8" />
              <path
                d="M70 82 C76 78 82 72 85 64"
                fill="none"
                stroke="#f3c969"
                strokeDasharray="3 4"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </g>
          ) : null}

          <circle cx="13" cy="87" fill="#67e8f9" opacity="0.85" r="3" />
          <circle cx="87" cy="13" fill={redSideStroke} opacity="0.85" r="3" />
          <path d="M12 87 L20 87 L12 79 Z" fill="#67e8f9" opacity="0.22" />
          <path d="M88 13 L80 13 L88 21 Z" fill={redSideStroke} opacity="0.22" />
        </svg>
      </div>
    </div>
  );
}

function getRoleLabel(role: LeagueRole) {
  if (role === "adc") {
    return "Bot";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
}
