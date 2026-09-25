import type {
  FindingsResponse,
  ReplayModel,
  ReplayQuestion,
  ReplayTraceResponse,
} from "./types";

export const MOCK_REPLAY_QUESTIONS: ReplayQuestion[] = [
  {
    id: "ci_spike",
    question:
      "Why did CI build failures spike for eslint/eslint in August 2026 compared to July 2026?",
  },
  {
    id: "review_effectiveness",
    question:
      "Is code review actually catching problems in tokio-rs/tokio, or are bugs slipping through despite approval? Look at review approval patterns and any later bug fixes.",
  },
  {
    id: "contributor_association",
    question:
      "Which contributors' changes in sqlalchemy/sqlalchemy are most associated with later bug-fix commits?",
  },
  {
    id: "cross_repo_ci_reliability",
    question:
      "Which of these three repositories has the more reliable CI pipeline, and why: tokio-rs/tokio, eslint/eslint, or sqlalchemy/sqlalchemy?",
  },
  {
    id: "review_turnaround_trend",
    question:
      "How long does it typically take for a pull request to get its first review in eslint/eslint, and has this changed recently?",
  },
];

export const MOCK_REPLAY_MODELS: ReplayModel[] = [
  { id: "deepseek/deepseek-v4-flash", provider: "DeepSeek" },
  { id: "deepseek/deepseek-v3.2", provider: "DeepSeek" },
  { id: "google/gemini-2.5-flash-lite", provider: "Google" },
  { id: "google/gemini-2.5-pro", provider: "Google" },
  { id: "anthropic/claude-haiku-4.5", provider: "Anthropic" },
  { id: "openai/gpt-5-mini", provider: "OpenAI" },
];

export const MOCK_FINDINGS: FindingsResponse = {
  overall_quality_variant_a: 6.53,
  overall_quality_variant_b: 5.5,
  per_model: [
    { model: "openai/gpt-5-mini", quality_a: 8.0, quality_b: 6.0, cost_ratio_b_over_a: 1.2 },
    {
      model: "google/gemini-2.5-flash-lite",
      quality_a: 4.6,
      quality_b: 3.2,
      cost_ratio_b_over_a: 1.8,
    },
    { model: "google/gemini-2.5-pro", quality_a: 6.6, quality_b: 5.4, cost_ratio_b_over_a: 1.2 },
    {
      model: "deepseek/deepseek-v4-flash",
      quality_a: 7.0,
      quality_b: 6.2,
      cost_ratio_b_over_a: 4.2,
    },
    { model: "deepseek/deepseek-v3.2", quality_a: 7.2, quality_b: 6.6, cost_ratio_b_over_a: 3.1 },
    {
      model: "anthropic/claude-haiku-4.5",
      quality_a: 5.8,
      quality_b: 5.6,
      cost_ratio_b_over_a: 4.1,
    },
  ],
};

function trace(
  question: string,
  model: string,
  variant: "a" | "b",
  converged: boolean,
): ReplayTraceResponse {
  if (variant === "a") {
    return {
      question,
      model,
      converged,
      elapsed_seconds: 42.3,
      final_answer: converged
        ? "CI failures spiked from a 4.1% baseline to 11.8% between July and August, driven almost entirely by a single flaky integration test (`test_concurrent_writes`) introduced in PR #4821 on August 3rd. Of the 87 failed runs in August, 61 point to that test. The failure rate returned to 4.3% after the test was quarantined on August 19th (PR #4902)."
        : null,
      steps: [
        {
          step_type: "tool_call",
          content: "Called query_ci_history",
          tool_name: "query_ci_history",
          tool_arguments: { repo: "eslint/eslint", date_from: "2026-08-01", date_to: "2026-08-31" },
        },
        {
          step_type: "tool_result",
          content:
            '{"repo": "eslint/eslint", "total_runs": 738, "failed_runs": 87, "overall_failure_rate": 0.1179}',
          tool_name: "query_ci_history",
          tool_arguments: null,
        },
        {
          step_type: "tool_call",
          content: "Called query_failed_test_breakdown",
          tool_name: "query_failed_test_breakdown",
          tool_arguments: { repo: "eslint/eslint", date_from: "2026-08-01", date_to: "2026-08-31" },
        },
        {
          step_type: "tool_result",
          content:
            '{"top_failing_tests": [{"name": "test_concurrent_writes", "failures": 61}, {"name": "test_lint_cache", "failures": 9}]}',
          tool_name: "query_failed_test_breakdown",
          tool_arguments: null,
        },
        converged
          ? {
              step_type: "final_answer",
              content:
                "CI failures spiked from a 4.1% baseline to 11.8% between July and August, driven almost entirely by a single flaky integration test (`test_concurrent_writes`) introduced in PR #4821 on August 3rd. Of the 87 failed runs in August, 61 point to that test. The failure rate returned to 4.3% after the test was quarantined on August 19th (PR #4902).",
              tool_name: null,
              tool_arguments: null,
            }
          : {
              step_type: "error",
              content: "Agent exceeded step budget without producing a final answer.",
              tool_name: null,
              tool_arguments: null,
            },
      ],
      quality_score: {
        correctness: 2,
        groundedness: 2,
        completeness: 2,
        no_fabrication: 2,
        total: 8,
        reasoning: "Directly cites the specific test and PRs responsible; numbers check out.",
      },
    };
  }

  return {
    question,
    model,
    converged,
    elapsed_seconds: 120.8,
    final_answer: converged
      ? "Looking at the CI data, failures went up in August. This could be due to test flakiness, infrastructure issues, or code changes. Without deeper investigation into individual test logs, it's hard to pin down the exact cause, but the pattern suggests something changed early in the month."
      : null,
    steps: [
      {
        step_type: "tool_call",
        content: "Wrote and ran Python code",
        tool_name: "run_python",
        tool_arguments: {
          code: "df = query('SELECT * FROM ci_runs WHERE repo = %s AND date >= %s', ...)\nprint(df.groupby('date')['status'].value_counts())",
        },
      },
      {
        step_type: "tool_result",
        content:
          '{"stdout": "date        status\\n2026-08-01  success   18\\n2026-08-01  failure    2\\n... (truncated)"}',
        tool_name: "run_python",
        tool_arguments: null,
      },
      converged
        ? {
            step_type: "final_answer",
            content:
              "Looking at the CI data, failures went up in August. This could be due to test flakiness, infrastructure issues, or code changes. Without deeper investigation into individual test logs, it's hard to pin down the exact cause, but the pattern suggests something changed early in the month.",
            tool_name: null,
            tool_arguments: null,
          }
        : {
            step_type: "error",
            content: "Agent exceeded step budget without producing a final answer.",
            tool_name: null,
            tool_arguments: null,
          },
    ],
    quality_score: {
      correctness: 1,
      groundedness: 1,
      completeness: 1,
      no_fabrication: 1,
      total: 4,
      reasoning: "Vague and hedged; never isolates the actual cause despite having raw data access.",
    },
  };
}

export function mockReplayTrace(
  model: string,
  variant: "a" | "b",
  questionId: string,
): ReplayTraceResponse {
  const q = MOCK_REPLAY_QUESTIONS.find((r) => r.id === questionId) ?? MOCK_REPLAY_QUESTIONS[0];
  return trace(q.question, model, variant, true);
}
