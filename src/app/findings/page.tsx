import { Card } from "@/components/ui/card";
import { getFindings } from "@/lib/api";

export default async function FindingsPage() {
  const findings = await getFindings();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Findings</h1>
      <p className="mt-2 text-muted-foreground">
        Six models, three repositories, five investigative questions. Here is what the study
        found.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Curated tools (Variant A)</p>
          <p className="mt-2 text-4xl font-semibold tabular-nums">
            {findings.overall_quality_variant_a.toFixed(2)}
            <span className="text-lg font-normal text-muted-foreground"> / 8</span>
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Open sandbox (Variant B)</p>
          <p className="mt-2 text-4xl font-semibold tabular-nums">
            {findings.overall_quality_variant_b.toFixed(2)}
            <span className="text-lg font-normal text-muted-foreground"> / 8</span>
          </p>
        </Card>
      </div>

      <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
        The curated-tools variant produced better answers than the open-sandbox variant for every
        one of the six models tested, though the size of the gap varied a lot by model. Giving an
        agent a small number of purpose-built tools that return clean, pre-computed results
        appears to outperform giving it open access to write and run its own code against the
        same data.
      </p>

      <h2 className="mt-12 text-lg font-medium">By model</h2>
      <div className="mt-4 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Model</th>
              <th className="px-4 py-3 font-medium">Quality (A)</th>
              <th className="px-4 py-3 font-medium">Quality (B)</th>
              <th className="px-4 py-3 font-medium">Cost ratio (B / A)</th>
            </tr>
          </thead>
          <tbody>
            {findings.per_model.map((row) => (
              <tr key={row.model} className="border-b last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{row.model}</td>
                <td className="px-4 py-3 tabular-nums">{row.quality_a.toFixed(2)}</td>
                <td className="px-4 py-3 tabular-nums">{row.quality_b.toFixed(2)}</td>
                <td className="px-4 py-3 tabular-nums">{row.cost_ratio_b_over_a.toFixed(1)}×</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Cost ratio is how many times more tool-call cost the open-sandbox variant used relative to
        the curated-tools variant, for the same question and model.
      </p>
    </div>
  );
}
