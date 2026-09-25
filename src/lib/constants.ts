import type { RepoId, ReplayModel } from "./types";

export const REPOS: RepoId[] = ["tokio-rs/tokio", "eslint/eslint", "sqlalchemy/sqlalchemy"];

// Kept small and cheap for the live Ask demo; the full six are used in Compare/Findings.
export const ASK_MODELS: ReplayModel[] = [
  { id: "openai/gpt-5-mini", provider: "OpenAI" },
  { id: "deepseek/deepseek-v4-flash", provider: "DeepSeek" },
];

export const ALL_MODELS: ReplayModel[] = [
  { id: "deepseek/deepseek-v4-flash", provider: "DeepSeek" },
  { id: "deepseek/deepseek-v3.2", provider: "DeepSeek" },
  { id: "google/gemini-2.5-flash-lite", provider: "Google" },
  { id: "google/gemini-2.5-pro", provider: "Google" },
  { id: "anthropic/claude-haiku-4.5", provider: "Anthropic" },
  { id: "openai/gpt-5-mini", provider: "OpenAI" },
];

export const SUGGESTED_QUESTIONS: string[] = [
  "Why did CI build failures spike recently?",
  "Is code review actually catching problems, or are bugs slipping through despite approval?",
  "Which contributors' changes are most associated with later bug-fix commits?",
  "How long does it typically take for a pull request to get its first review, and has this changed recently?",
];
