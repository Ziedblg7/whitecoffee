interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export function PageHero({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="relative overflow-hidden bg-[var(--gradient-soft)] py-20 md:py-28">
      <div className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(circle_at_20%_20%,var(--primary-soft),transparent_50%),radial-gradient(circle_at_80%_60%,var(--primary-soft),transparent_55%)]" />
      <div className="mx-auto max-w-4xl px-6 text-center">
        {eyebrow && (
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-accent">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-5xl font-semibold text-primary md:text-6xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
