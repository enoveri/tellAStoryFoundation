type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--primary-subtle)] p-6 text-center">
      <h3 className="text-base font-semibold text-[color:var(--foreground)]">
        {title}
      </h3>
      <p className="mt-2 text-sm text-[color:var(--muted)]">{description}</p>
    </div>
  );
}
