import type { ReactNode } from "react";

// Shared shell for the legal pages (/terms, /privacy) so both read as one
// document family: constrained measure, quiet type, numbered sections.

export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {updated}
      </p>
      <div className="mt-6 text-sm leading-relaxed text-muted-foreground">
        {intro}
      </div>
      <div className="mt-10 flex flex-col gap-8">{children}</div>
    </article>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-medium tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
