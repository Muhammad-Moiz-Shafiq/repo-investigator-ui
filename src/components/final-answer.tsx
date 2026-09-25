import { CheckCircle2, HelpCircle } from "lucide-react";

export function FinalAnswer({
  answer,
  converged,
}: {
  answer: string | null;
  converged: boolean;
}) {
  if (!converged || !answer) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <HelpCircle className="mx-auto size-5 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium">No answer reached</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The agent did not converge on a final answer within its step budget. This happens on
          some questions and is a real outcome, not a bug.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="size-4" />
        Final answer
      </div>
      <p className="text-base leading-relaxed">{answer}</p>
    </div>
  );
}
