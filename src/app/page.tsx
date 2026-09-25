import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const LINKS = [
  {
    href: "/ask",
    title: "Ask",
    description: "Pick a repo and question, watch the agent investigate it live, step by step.",
  },
  {
    href: "/compare",
    title: "Compare",
    description: "See the curated-tools and open-sandbox agents answer the same question, side by side.",
  },
  {
    href: "/findings",
    title: "Findings",
    description: "The study's headline results: which approach produced better answers, and at what cost.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-sm font-medium text-muted-foreground">Research project</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        Autonomous Repository Investigator
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
        An AI agent that investigates a repository&apos;s commits, pull requests, issues, and CI
        runs to answer open-ended questions about it — and cites its evidence the way an engineer
        would.
      </p>
      <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
        Across six models and three real repositories, giving the agent a small set of curated
        tools beat giving it open access to write and run its own code, for every model tested.
      </p>

      <div className="mt-10 flex gap-3">
        <Button render={<Link href="/ask" />}>
          Try it live <ArrowRight className="size-4" />
        </Button>
        <Button variant="outline" render={<Link href="/findings" />}>
          See the findings
        </Button>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-lg border p-5 transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{link.title}</h2>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {link.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
