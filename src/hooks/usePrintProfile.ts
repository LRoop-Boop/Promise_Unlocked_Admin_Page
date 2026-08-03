import { useState, useEffect } from "react";
import { buildPrintableStamps, type PrintableStamp } from "../utils/printReport";

export function usePrintProfile(token: string | null, participantId: string) {
  const [printStamps, setPrintStamps] = useState<PrintableStamp[] | null>(null);
  const [printLoading, setPrintLoading] = useState(false);

  useEffect(() => {
  if (!printStamps) return;

  const timeout = window.setTimeout(() => {
    window.print();
  }, 500); 

  const reset = () => setPrintStamps(null);

  window.addEventListener("afterprint", reset);

  return () => {
    clearTimeout(timeout);
    window.removeEventListener("afterprint", reset);
  };
}, [printStamps]);

  const handlePrint = async () => {
    if (!token) return;
    setPrintLoading(true);
    try {
      const data = await buildPrintableStamps(token, participantId);
      setPrintStamps(data);
    } catch (e) {
      console.error("Failed to build print report:", e);
      setPrintStamps([]);
    } finally {
      setPrintLoading(false);
    }
  };

  return { printStamps, printLoading, handlePrint };
}