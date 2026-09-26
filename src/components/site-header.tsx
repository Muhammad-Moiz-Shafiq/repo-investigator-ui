"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/ask", label: "Ask" },
  { href: "/compare", label: "Compare" },
  { href: "/findings", label: "Findings" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-medium tracking-tight">
          <Image src="/dark.png" alt="" width={20} height={20} className="dark:hidden" />
          <Image
            src="/light.png"
            alt=""
            width={20}
            height={20}
            className="hidden dark:block dark:invert"
          />
          Repo Investigator
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
