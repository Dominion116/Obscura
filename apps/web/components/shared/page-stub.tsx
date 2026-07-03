// Temporary placeholder used while a page's phase is pending. Each stub
// disappears as its phase lands (see implementation.md).

export function PageStub({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <div className="glass mx-auto mt-16 max-w-xl rounded-(--radius-card) p-8 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-sm text-muted">{description}</p>
      <p className="mt-6 inline-flex rounded-full bg-cobalt-500/10 px-3 py-1 text-xs font-medium text-cobalt-300">
        Arriving in {phase}
      </p>
    </div>
  );
}
