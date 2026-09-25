import {
  MOCK_FINDINGS,
  MOCK_REPLAY_MODELS,
  MOCK_REPLAY_QUESTIONS,
  mockReplayTrace,
} from "./mock-data";
import type {
  FindingsResponse,
  InvestigateResponse,
  ModelId,
  RepoId,
  ReplayModel,
  ReplayQuestion,
  ReplayTraceResponse,
  Variant,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export class ApiRequestError extends Error {}

async function parseErrorBody(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.error === "string") return body.error;
  } catch {
    // fall through
  }
  return `Request failed with status ${res.status}`;
}

export async function investigate(params: {
  repo: RepoId;
  question: string;
  model: ModelId;
}): Promise<InvestigateResponse> {
  const res = await fetch(`${API_BASE_URL}/api/investigate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new ApiRequestError(await parseErrorBody(res));
  return res.json();
}

export async function getReplayQuestions(): Promise<ReplayQuestion[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/replay/questions`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return MOCK_REPLAY_QUESTIONS;
  }
}

export async function getReplayModels(): Promise<ReplayModel[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/replay/models`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return MOCK_REPLAY_MODELS;
  }
}

export async function getReplayTrace(params: {
  model: string;
  variant: Variant;
  questionId: string;
}): Promise<ReplayTraceResponse> {
  try {
    const search = new URLSearchParams({
      model: params.model,
      variant: params.variant,
      question_id: params.questionId,
    });
    const res = await fetch(`${API_BASE_URL}/api/replay/trace?${search.toString()}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return mockReplayTrace(params.model, params.variant, params.questionId);
  }
}

export async function getFindings(): Promise<FindingsResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/findings`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return MOCK_FINDINGS;
  }
}
