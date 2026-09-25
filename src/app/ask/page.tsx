"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TraceSkeleton } from "@/components/trace-skeleton";
import { TraceView } from "@/components/trace-view";
import { ApiRequestError, investigate } from "@/lib/api";
import { ASK_MODELS, REPOS, SUGGESTED_QUESTIONS } from "@/lib/constants";
import type { InvestigateResponse, ModelId, RepoId } from "@/lib/types";

export default function AskPage() {
  const [repo, setRepo] = useState<RepoId>(REPOS[0]);
  const [model, setModel] = useState<ModelId>(ASK_MODELS[0].id);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InvestigateResponse | null>(null);

  async function handleSubmit() {
    if (!question.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await investigate({ repo, question: question.trim(), model });
      setResult(res);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Ask</h1>
      <p className="mt-2 text-muted-foreground">
        Pick a repository and a model, ask a question, and watch the agent investigate it live.
      </p>

      <Card className="mt-8 space-y-5 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Repository</label>
            <Select value={repo} onValueChange={(v) => setRepo(v as RepoId)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPOS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Model</label>
            <Select value={model} onValueChange={(v) => setModel(v as ModelId)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASK_MODELS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.provider} — {m.id.split("/")[1]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Why did CI build failures spike recently?"
            rows={3}
            className="w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuestion(q)}
                className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {q.length > 48 ? `${q.slice(0, 48)}…` : q}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={loading || !question.trim()}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Investigating…" : "Investigate"}
        </Button>
      </Card>

      <div className="mt-10">
        {loading && <TraceSkeleton />}
        {error && !loading && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
        {result && !loading && (
          <TraceView
            steps={result.steps}
            finalAnswer={result.final_answer}
            converged={result.converged}
            elapsedSeconds={result.elapsed_seconds}
          />
        )}
      </div>
    </div>
  );
}
