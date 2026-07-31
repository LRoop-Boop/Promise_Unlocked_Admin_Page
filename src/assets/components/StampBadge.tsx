import { useState } from "react";
import {
  TIER_CONFIG,
  DEFAULT_TIER,
  getStampBaseImage,
  TIER_WRAPPERS,
} from "../config/stampConstants";

interface StampBadgeProps {
  stampName: string;
  tier?: number;
  size?: "list" | "detail";
}

// Matches the mobile app's StampBadge geometry exactly, so the same
// wrapper/base assets line up the same way on web.
const SIZES = {
  list: { wrapper: 94, base: 60, offset: 17 },
  detail: { wrapper: 120, base: 76, offset: 22 },
} as const;

export default function StampBadge({
  stampName,
  tier = DEFAULT_TIER,
  size = "list",
}: Readonly<StampBadgeProps>) {
  const [error, setError] = useState(false);

  const tierCfg =
    TIER_CONFIG[tier as keyof typeof TIER_CONFIG] ?? TIER_CONFIG[DEFAULT_TIER];
  const dims = SIZES[size];

  if (error) {
    const circleSize = size === "detail" ? 110 : 86;
    return (
      <div
        className="flex items-center justify-center"
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          backgroundColor: tierCfg.color,
        }}
      >
        <span
          className="text-white font-extrabold"
          style={{ fontSize: size === "detail" ? 32 : 18 }}
        >
          {tierCfg.label}
        </span>
      </div>
    );
  }

  return (
    <div
      className="relative"
      style={{ width: dims.wrapper, height: dims.wrapper }}
    >
      <img
        src={TIER_WRAPPERS[tier]?.uri ?? TIER_WRAPPERS[DEFAULT_TIER].uri}
        alt=""
        aria-hidden="true"
        className="absolute top-0 left-0"
        style={{ width: dims.wrapper, height: dims.wrapper }}
        onError={() => setError(true)}
      />
      <img
        src={getStampBaseImage(stampName).uri}
        alt={stampName}
        className="absolute rounded-full"
        style={{
          width: dims.base,
          height: dims.base,
          top: dims.offset,
          left: dims.offset,
        }}
      />
    </div>
  );
}