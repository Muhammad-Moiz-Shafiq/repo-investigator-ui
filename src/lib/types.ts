export type RepoId = "tokio-rs/tokio" | "eslint/eslint" | "sqlalchemy/sqlalchemy";

export type ModelId =
  | "deepseek/deepseek-v4-flash"
  | "deepseek/deepseek-v3.2"
  | "google/gemini-2.5-flash-lite"
  | "google/gemini-2.5-pro"
  | "anthropic/claude-haiku-4.5"
  | "openai/gpt-5-mini";

export type Variant = "a" | "b";

export type StepType = "tool_call" | "tool_result" | "final_answer" | "error";

export interface TraceStep {
  step_type: StepType;
  content: string;
  tool_name: string | null;
  tool_arguments: Record<string, unknown> | null;
}

export interface QualityScore {
  correctness: number;
  groundedness: number;
  completeness: number;
  no_fabrication: number;
  total: number;
  reasoning: string;
}

export interface InvestigateResponse {
  question: string;
  model: string;
  converged: boolean;
  final_answer: string | null;
  elapsed_seconds: number;
  steps: TraceStep[];
}

export interface ReplayTraceResponse extends InvestigateResponse {
  quality_score: QualityScore | null;
}

export interface ReplayQuestion {
  id: string;
  question: string;
}

export interface ReplayModel {
  id: ModelId;
  provider: string;
}

export interface FindingsPerModel {
  model: string;
  quality_a: number;
  quality_b: number;
  cost_ratio_b_over_a: number;
}

export interface FindingsResponse {
  overall_quality_variant_a: number;
  overall_quality_variant_b: number;
  per_model: FindingsPerModel[];
}

export interface ApiError {
  error: string;
}
