# Handoff: Autonomous Repository Investigator: Frontend

You are working on the frontend for a research project called the Autonomous Repository
Investigator. A separate Claude session is building the backend API in a different repo
at the same time. This document is the full context you need to work independently. Read
it fully before writing any code. If something is genuinely ambiguous after reading this,
ask the user rather than guessing, since they are relaying between this session and the
backend session.

## What this project actually is

The project built an AI agent that investigates a software repository's development
history (commits, pull requests, issues, CI runs) and answers open-ended questions about
it, citing evidence for its claims, the way an engineer would when asked to explain why
something happened in a codebase.

The research question behind it: should an agent like this be given a small number of
curated, narrow tools, or open access to write and run its own code against the data?
Two versions of the same agent were built to test this.

Variant A gives the agent six purpose-built tools, each returning a clean, pre-computed
result (for example, "get CI failure rate for this repo between these two dates").

Variant B gives the agent one tool: the ability to write and run arbitrary Python code
inside a sandboxed container with read-only database access. It has to write its own
queries.

Both variants were tested against six language models (from DeepSeek, Google, Anthropic,
and OpenAI) on five real investigative questions across three repositories: tokio-rs/tokio,
eslint/eslint, and sqlalchemy/sqlalchemy. The headline finding: the curated-tools variant
produced better answers than the open-sandbox variant for every one of the six models
tested, though the size of the gap varied a lot by model. The full write-up with methodology,
tables, and figures is in `Project_Report.docx` in the parent project folder if you want more
depth, but everything you need to build the frontend is in this document.

## What you are building

A small web application with three views, deliberately scoped this way to avoid the
security and hosting complexity of running Variant B's code execution live in a public
app:

1. **Ask**: a visitor picks a repository and a model, types (or picks a suggested)
   question, and watches Variant A actually investigate it live, step by step: its
   reasoning, which tool it calls, the tool's result, then either another step or a final
   answer.

2. **Compare**: a visitor picks one of the five fixed test questions and a model, and
   sees Variant A's and Variant B's saved traces from the actual study, side by side. This
   is not live. It is reading pre-computed results from the backend. This view is meant to
   make the actual research finding visible and concrete, not just a chart.

3. **Findings**: a summary of the study's real results: the headline quality numbers,
   the tool-call cost comparison, and a short written explanation, similar in spirit to an
   abstract plus results section.

Variant B is never run live in this application. It only ever appears as pre-computed,
already-vetted saved data in the Compare view. A live version of Variant B using a managed
sandbox provider is planned as a future addition, gated behind a password or a
visitor-supplied API key, but that is out of scope for now. Do not build anything that
tries to execute code live.

## Design goal

Minimalistic but genuinely well designed, not sparse for its own sake. The real content
here is the agent's reasoning trace: what it thought, what it called, what came back, what
it concluded. The design's job is to make that trace easy to read and visually easy to
tell apart step by step, not to decorate around it.

Concrete guidance:

- Use Next.js with the App Router and TypeScript. Use Tailwind CSS, and a component
  library built on top of it such as shadcn/ui, rather than building every primitive from
  scratch. This gets you a clean, modern baseline quickly.
- Support both light and dark mode.
- Give each step type in a trace a distinct, quiet visual treatment, for example a small
  icon or a colored left border: reasoning, tool call, tool result, final answer. Use a
  monospace font for tool arguments and tool results, since those are data, and a regular
  font for reasoning and the final answer, since those are prose.
- Generous whitespace, clear type hierarchy, no unnecessary chrome or animation. Avoid
  spinner-heavy loading states; prefer skeleton placeholders that hint at the shape of what
  is coming.
- The final answer in any trace should be visually the most prominent thing on the page,
  since it is the actual deliverable of a real investigation.

## Repository and deployment

This repo (`repo-frontend`) deploys to Vercel as its own project. The backend lives in a
different repo (`repo-investigator`, inside a subfolder called `api/`) and deploys as a
separate Vercel project with its own URL. This frontend should never import backend code
directly; it only ever talks to the backend over HTTP, using a configurable base URL, for
example an environment variable called `NEXT_PUBLIC_API_BASE_URL`. Default it to
`http://localhost:8000` for local development against a locally run backend, and expect
the real deployed backend URL to be provided later.

## The API contract

This is the important part. Build against these exact shapes. They come directly from
the real, already-collected research data, not from a guess at what the backend might
return.

### `POST /api/investigate` (live Variant A)

Request body:

```json
{
  "repo": "tokio-rs/tokio",
  "question": "Why did CI build failures spike recently?",
  "model": "openai/gpt-5-mini"
}
```

`repo` is one of exactly three values: `tokio-rs/tokio`, `eslint/eslint`,
`sqlalchemy/sqlalchemy`. `model` is one of exactly six values, listed below. Expect this
call to take anywhere from about ten seconds to a few minutes to return, since it runs a
real multi-step agent loop. Design the UI around a real wait, not an instant response:
show the steps as they are returned, or at minimum a clear, honest progress indicator
while waiting, not a spinner that implies a one-second operation.

Response body, on success:

```json
{
  "question": "Why did CI build failures spike recently?",
  "model": "openai/gpt-5-mini",
  "converged": true,
  "final_answer": "The full text of the agent's final answer, in prose, citing which tool calls support each claim.",
  "elapsed_seconds": 42.3,
  "steps": [
    {
      "step_type": "tool_call",
      "content": "Called query_ci_history",
      "tool_name": "query_ci_history",
      "tool_arguments": { "repo": "tokio-rs/tokio", "date_from": "2026-08-01", "date_to": "2026-08-31" }
    },
    {
      "step_type": "tool_result",
      "content": "{\"repo\": \"tokio-rs/tokio\", \"total_runs\": 1313, \"failed_runs\": 87, \"overall_failure_rate\": 0.0663, ...}",
      "tool_name": "query_ci_history",
      "tool_arguments": null
    },
    {
      "step_type": "final_answer",
      "content": "The full text of the final answer (same as the top-level final_answer field).",
      "tool_name": null,
      "tool_arguments": null
    }
  ]
}
```

Notes on this shape, from the real, already-built agent code:

- `step_type` is one of exactly four values: `tool_call`, `tool_result`, `final_answer`,
  `error`. There is no separate free-text "reasoning" step type in the current data; a
  model's reasoning, when it produces any before a tool call, is folded into the
  surrounding text or the final answer itself. Design for these four step types, not a
  fifth "thinking" type.
- `tool_result.content` is a JSON object serialized as a string, truncated to 500
  characters in the saved data. Parse it and pretty-print it if you want to render it as
  structured data; otherwise it is safe to just render as preformatted text.
- `tool_arguments` is `null` on every step type except `tool_call`.
- If the loop never converges, `converged` is `false` and `final_answer` is `null`. Design
  a clear, honest empty state for this. It is a real, expected outcome, not just an error
  case; some questions genuinely do not always get answered.
- On a genuine failure (for example, the backend cannot reach the model provider), expect
  an HTTP error status with a body of `{ "error": "a human-readable message" }`. Show this
  plainly rather than a generic failure screen.

The six valid values for `model` are:

```
deepseek/deepseek-v4-flash
deepseek/deepseek-v3.2
google/gemini-2.5-flash-lite
google/gemini-2.5-pro
anthropic/claude-haiku-4.5
openai/gpt-5-mini
```

A reasonable default for the live Ask view is to only offer one or two of the cheaper,
faster models (for example `openai/gpt-5-mini` and `deepseek/deepseek-v4-flash`) rather
than all six, to keep a public demo's cost and latency predictable. Confirm the final
default list with the user before shipping, but build the model selector as a dropdown
so this is trivial to change.

### `GET /api/replay/questions`

Returns the five fixed test questions used in the study.

```json
[
  { "id": "ci_spike", "question": "Why did CI build failures spike for eslint/eslint in August 2026 compared to July 2026?" },
  { "id": "review_effectiveness", "question": "Is code review actually catching problems in tokio-rs/tokio, or are bugs slipping through despite approval? Look at review approval patterns and any later bug fixes." },
  { "id": "contributor_association", "question": "Which contributors' changes in sqlalchemy/sqlalchemy are most associated with later bug-fix commits?" },
  { "id": "cross_repo_ci_reliability", "question": "Which of these three repositories has the more reliable CI pipeline, and why: tokio-rs/tokio, eslint/eslint, or sqlalchemy/sqlalchemy?" },
  { "id": "review_turnaround_trend", "question": "How long does it typically take for a pull request to get its first review in eslint/eslint, and has this changed recently?" }
]
```

### `GET /api/replay/models`

Returns the six models with a display-friendly provider label, for populating dropdowns.

```json
[
  { "id": "deepseek/deepseek-v4-flash", "provider": "DeepSeek" },
  { "id": "deepseek/deepseek-v3.2", "provider": "DeepSeek" },
  { "id": "google/gemini-2.5-flash-lite", "provider": "Google" },
  { "id": "google/gemini-2.5-pro", "provider": "Google" },
  { "id": "anthropic/claude-haiku-4.5", "provider": "Anthropic" },
  { "id": "openai/gpt-5-mini", "provider": "OpenAI" }
]
```

### `GET /api/replay/trace?model=<id>&variant=<a|b>&question_id=<id>`

Returns one saved, already-completed trace for the Compare view. Same shape as the
`/api/investigate` response, with one addition: a `quality_score` object, since these are
graded answers from the study, or `null` if that particular combination was never
graded.

```json
{
  "question": "Why did CI build failures spike for eslint/eslint in August 2026 compared to July 2026?",
  "model": "deepseek/deepseek-v3.2",
  "converged": true,
  "final_answer": "The full text of the answer...",
  "elapsed_seconds": 120.8,
  "steps": [ ],
  "quality_score": {
    "correctness": 2,
    "groundedness": 2,
    "completeness": 2,
    "no_fabrication": 0,
    "total": 6,
    "reasoning": "One sentence or two explaining the score, from the independent judge that graded this answer."
  }
}
```

The Compare view's natural layout is two of these side by side, one for `variant=a` and
one for `variant=b`, for the same model and question. Consider showing the `total` score
prominently on each side so the difference is immediately visible, with the full
`reasoning` text available on hover or expand rather than always shown, to keep the layout
clean.

### `GET /api/findings`

Returns the headline results for the Findings view. Shape to be finalized with the
backend, but expect at minimum a per-model quality table and a per-model cost-ratio
table, roughly:

```json
{
  "overall_quality_variant_a": 6.53,
  "overall_quality_variant_b": 5.50,
  "per_model": [
    { "model": "openai/gpt-5-mini", "quality_a": 8.00, "quality_b": 6.00, "cost_ratio_b_over_a": 1.2 },
    { "model": "google/gemini-2.5-flash-lite", "quality_a": 4.60, "quality_b": 3.20, "cost_ratio_b_over_a": 1.8 },
    { "model": "google/gemini-2.5-pro", "quality_a": 6.60, "quality_b": 5.40, "cost_ratio_b_over_a": 1.2 },
    { "model": "deepseek/deepseek-v4-flash", "quality_a": 7.00, "quality_b": 6.20, "cost_ratio_b_over_a": 4.2 },
    { "model": "deepseek/deepseek-v3.2", "quality_a": 7.20, "quality_b": 6.60, "cost_ratio_b_over_a": 3.1 },
    { "model": "anthropic/claude-haiku-4.5", "quality_a": 5.80, "quality_b": 5.60, "cost_ratio_b_over_a": 4.1 }
  ]
}
```

These specific numbers are the real, final results as of this handoff, so it is safe to
build against them directly, including hardcoding them as a fallback if the live endpoint
is not ready yet. Quality scores are out of eight.

## What you do not need to worry about

You do not need to know anything about how the agent works internally, how the database
is structured, how the Docker sandbox is secured, or how the language models are called.
All of that is the backend's responsibility, entirely hidden behind the four endpoints
above. If you find yourself wanting to know more of that detail to make a frontend
decision, it is a sign the API contract is missing something, and worth raising with the
user rather than guessing at backend internals.

## Suggested page structure

- `/` : short landing page: what this is, one line on the finding, links to the three
  views below.
- `/ask` : the live Variant A view.
- `/compare` : the replay view.
- `/findings` : the results summary view.

## Working style

Build incrementally and show real, working screens rather than a large batch of
unreviewed code. Use the exact JSON shapes above for local mock data until a live backend
URL is available, so that switching to the real backend later is just changing the base
URL, not rewriting data handling. Ask the user if anything above is unclear rather than
inventing backend behavior that was not specified here.
