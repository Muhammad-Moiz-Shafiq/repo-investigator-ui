import { ArrowUpRight } from "lucide-react";

import { MAIN_STUDY_URL } from "@/lib/study";

export function PilotBanner() {
  return (
    <div className="border-b bg-muted/40">
      <p className="mx-auto max-w-5xl px-6 py-2 text-sm text-muted-foreground">
        This is the demo from the pilot study (September 2026). The full study has since been
        completed.{" "}
        <a
          href={MAIN_STUDY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-medium text-foreground underline underline-offset-4"
        >
          Read about the full study <ArrowUpRight className="size-3.5" />
        </a>
      </p>
    </div>
  );
}
