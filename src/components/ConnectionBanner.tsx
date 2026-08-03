import { WifiOff } from "lucide-react";

export function ConnectionBanner() {
  return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-2 rounded-lg mb-4">
      <WifiOff size={16} className="shrink-0" />
      <span>
        Can't reach the server right now — check your connection. Some data may be out of date.
      </span>
    </div>
  );
}