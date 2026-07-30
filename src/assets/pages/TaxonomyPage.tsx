import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { STAMP_TAXONOMY, REGIONS } from "../data/Taxonomy";

interface StampRow {
  region: string;
  stamp: string;
}

const REGION_PALETTES = [
  { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500" },
  { bg: "bg-purple-50",  text: "text-purple-700",  dot: "bg-purple-500" },
  { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500" },
  { bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-500" },
  { bg: "bg-cyan-50",    text: "text-cyan-700",    dot: "bg-cyan-500" },
  { bg: "bg-orange-50",  text: "text-orange-700",  dot: "bg-orange-500" },
  { bg: "bg-indigo-50",  text: "text-indigo-700",  dot: "bg-indigo-500" },
  { bg: "bg-teal-50",    text: "text-teal-700",    dot: "bg-teal-500" },
  { bg: "bg-pink-50",    text: "text-pink-700",    dot: "bg-pink-500" },
  { bg: "bg-lime-50",    text: "text-lime-700",    dot: "bg-lime-500" },
  { bg: "bg-fuchsia-50", text: "text-fuchsia-700", dot: "bg-fuchsia-500" },
];

const REGION_COLORS: Record<string, typeof REGION_PALETTES[number]> = Object.fromEntries(
  REGIONS.map((region, i) => [region, REGION_PALETTES[i % REGION_PALETTES.length]])
);

export default function TaxonomyPage() {
  const [search, setSearch] = useState("");

  const rows = useMemo<StampRow[]>(() => {
    const out: StampRow[] = [];
    for (const [region, families] of Object.entries(STAMP_TAXONOMY)) {
      for (const family of families) {
        if (family.detailedStamps?.length) {
          for (const detail of family.detailedStamps) {
            out.push({
              region,
              stamp: `${family.stampCategory}: ${detail.name}`,
            });
          }
        } else {
          out.push({
            region,
            stamp: family.stampCategory,
          });
        }
      }
    }
    return out;
  }, []);

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.region.toLowerCase().includes(q) ||
      r.stamp.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search region or stamp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <span className="text-sm text-gray-500">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-72">Region</TableHead>
                <TableHead>Stamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={2} className="text-center text-gray-500 py-10">
                    No stamps found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r, i) => {
                  const palette = REGION_COLORS[r.region];
                  return (
                    <TableRow
                      key={`${r.region}-${r.stamp}-${i}`}
                      className={`${palette.bg} hover:${palette.bg}`}
                    >
                      <TableCell className={`whitespace-nowrap pr-12 font-medium ${palette.text}`}>
                        {r.region}
                      </TableCell>
                      <TableCell className="font-medium pl-4 text-gray-700">{r.stamp}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}