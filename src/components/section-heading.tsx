import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

/** Título display grande com link laranja opcional à direita, no estilo do site. */
export function SectionHeading({
  title,
  linkTo,
  linkLabel,
  linkSearch,
  children,
}: {
  title: ReactNode;
  linkTo?: string;
  linkLabel?: string;
  linkSearch?: Record<string, unknown>;
  children?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-3xl leading-[0.95] md:text-5xl">{title}</h2>
        {children}
      </div>
      {linkTo && linkLabel && (
        <Link
          to={linkTo}
          search={linkSearch as never}
          className="group inline-flex items-center gap-2 text-sm font-bold text-accent"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </header>
  );
}
