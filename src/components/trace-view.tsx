import { FinalAnswer } from "@/components/final-answer";
import { TraceStep } from "@/components/trace-step";
import type { TraceStep as TraceStepData } from "@/lib/types";

export function TraceView({
  steps,
  finalAnswer,
  converged,
  elapsedSeconds,
}: {
  steps: TraceStepData[];
  finalAnswer: string | null;
  converged: boolean;
  elapsedSeconds?: number;
}) {
  const nonFinalSteps = steps.filter((s) => s.step_type !== "final_answer");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        {nonFinalSteps.map((step, i) => (
          <TraceStep key={i} step={step} />
        ))}
      </div>
      <FinalAnswer answer={finalAnswer} converged={converged} />
      {typeof elapsedSeconds === "number" && (
        <p className="text-xs text-muted-foreground">
          Completed in {elapsedSeconds.toFixed(1)}s across {steps.length} step
          {steps.length === 1 ? "" : "s"}.
        </p>
      )}
    </div>
  );
}
