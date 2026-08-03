import { WifiOff, AlertTriangle, RotateCw } from "lucide-react";

export function FullPageError({
  variant,
  message,
  onRetry,
}: {
  variant: "offline" | "generic";
  message?: string;
  onRetry: () => void;
}) {
  const Icon = variant === "offline" ? WifiOff : AlertTriangle;
  const heading = variant === "offline" ? "You're offline" : "Something went wrong";
  const body =
    variant === "offline"
      ? "We can't reach the server. Check your connection and try again."
      : message ?? "We couldn't load your data. Please try again.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="text-center max-w-sm">
        <Icon size={40} className="mx-auto text-gray-400 mb-4" />
        <h1 className="text-lg font-semibold text-gray-800 mb-1">{heading}</h1>
        <p className="text-sm text-gray-500 mb-6">{body}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RotateCw size={14} />
          Try again
        </button>
      </div>
    </div>
  );
}