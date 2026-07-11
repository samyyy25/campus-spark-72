import type { ReactNode } from "react";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl p-6">{children}</div>;
}

export function EmptyState({ title, description, icon: Icon }: { title: string; description?: string; icon?: any }) {
  return (
    <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
      {Icon && <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-secondary text-muted-foreground"><Icon className="h-6 w-6" /></div>}
      <div className="text-base font-semibold">{title}</div>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
