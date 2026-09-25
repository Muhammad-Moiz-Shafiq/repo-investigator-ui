"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TraceView } from "@/components/trace-view";
import { getReplayModels, getReplayQuestions, getReplayTrace } from "@/lib/api";
import type { ReplayModel, ReplayQuestion, ReplayTraceResponse, Variant } from "@/lib/types";

function ScorePill({ trace }: { trace: ReplayTraceResponse | null }) {
  if (!trace?.quality_score) return null;
  const { total, reasoning } = trace.quality_score;
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span className="inline-flex cursor-default items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium" />
        }
      >
        Quality {total}/8
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">{reasoning}</TooltipContent>
    </Tooltip>
  );
}

function VariantColumn({
  label,
  description,
  trace,
  loading,
}: {
  label: string;
  description: string;
  trace: ReplayTraceResponse | null;
  loading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-medium">{label}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <ScorePill trace={trace} />
      </div>
      {loading || !trace ? (
        <div className="space-y-3">
          <div className="h-24 animate-pulse rounded-md bg-muted/60" />
          <div className="h-24 animate-pulse rounded-md bg-muted/60" />
        </div>
      ) : (
        <TraceView
          steps={trace.steps}
          finalAnswer={trace.final_answer}
          converged={trace.converged}
          elapsedSeconds={trace.elapsed_seconds}
        />
      )}
    </div>
  );
}

export default function ComparePage() {
  const [questions, setQuestions] = useState<ReplayQuestion[]>([]);
  const [models, setModels] = useState<ReplayModel[]>([]);
  const [questionId, setQuestionId] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [traceA, setTraceA] = useState<ReplayTraceResponse | null>(null);
  const [traceB, setTraceB] = useState<ReplayTraceResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getReplayQuestions().then((qs) => {
      setQuestions(qs);
      if (qs[0]) setQuestionId(qs[0].id);
    });
    getReplayModels().then((ms) => {
      setModels(ms);
      if (ms[0]) setModel(ms[0].id);
    });
  }, []);

  useEffect(() => {
    if (!questionId || !model) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicks off a loading state for the fetch this effect starts
    setLoading(true);
    const variants: Variant[] = ["a", "b"];
    Promise.all(variants.map((variant) => getReplayTrace({ model, variant, questionId }))).then(
      ([a, b]) => {
        if (cancelled) return;
        setTraceA(a);
        setTraceB(b);
        setLoading(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [questionId, model]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Compare</h1>
      <p className="mt-2 text-muted-foreground">
        The curated-tools agent and the open-sandbox agent answering the same question, from the
        actual study data.
      </p>

      <Card className="mt-8 grid gap-4 p-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Question</label>
          <Select value={questionId} onValueChange={(v) => v && setQuestionId(v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {questions.map((q) => (
                <SelectItem key={q.id} value={q.id}>
                  {q.question.length > 70 ? `${q.question.slice(0, 70)}…` : q.question}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Model</label>
          <Select value={model} onValueChange={(v) => v && setModel(v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.provider} — {m.id.split("/")[1]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <VariantColumn
          label="Variant A"
          description="Curated tools"
          trace={traceA}
          loading={loading}
        />
        <VariantColumn
          label="Variant B"
          description="Open sandbox"
          trace={traceB}
          loading={loading}
        />
      </div>
    </div>
  );
}
