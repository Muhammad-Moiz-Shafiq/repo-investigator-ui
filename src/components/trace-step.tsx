import { AlertTriangle, ArrowRight, CheckCircle2, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TraceStep as TraceStepData } from "@/lib/types";

const STEP_META: Record<
  TraceStepData["step_type"],
  { label: string; icon: typeof Wrench; border: string; iconColor: string }
> = {
  tool_call: {
    label: "Tool call",
    icon: ArrowRight,
    border: "border-l-sky-400/70 dark:border-l-sky-500/60",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  tool_result: {
    label: "Tool result",
    icon: Wrench,
    border: "border-l-amber-400/70 dark:border-l-amber-500/60",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  final_answer: {
    label: "Final answer",
    icon: CheckCircle2,
    border: "border-l-emerald-400/70 dark:border-l-emerald-500/60",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  error: {
    label: "Error",
    icon: AlertTriangle,
    border: "border-l-red-400/70 dark:border-l-red-500/60",
    iconColor: "text-red-600 dark:text-red-400",
  },
};

function prettyPrint(content: string): string {
  try {
    return JSON.stringify(JSON.parse(content), null, 2);
  } catch {
    return content;
  }
}

export function TraceStep({ step }: { step: TraceStepData }) {
  const meta = STEP_META[step.step_type];
  const Icon = meta.icon;
  const isData = step.step_type === "tool_call" || step.step_type === "tool_result";

  return (
    <div className={cn("border-l-2 py-3 pl-4", meta.border)}>
      <div className="flex items-center gap-2 text-xs font-medium">
        <Icon className={cn("size-3.5", meta.iconColor)} />
        <span className={meta.iconColor}>{meta.label}</span>
        {step.tool_name && (
          <span className="font-mono text-muted-foreground">{step.tool_name}</span>
        )}
      </div>

      {step.tool_arguments && (
        <pre className="mt-2 overflow-x-auto rounded-md bg-muted/60 px-3 py-2 font-mono text-xs text-muted-foreground">
          {JSON.stringify(step.tool_arguments, null, 2)}
        </pre>
      )}

      {isData ? (
        <pre className="mt-2 overflow-x-auto rounded-md bg-muted/60 px-3 py-2 font-mono text-xs">
          {prettyPrint(step.content)}
        </pre>
      ) : (
        <p className="mt-2 text-sm leading-relaxed">{step.content}</p>
      )}
    </div>
  );
}
