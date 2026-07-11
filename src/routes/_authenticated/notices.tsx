import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader, EmptyState } from "@/lib/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Pin } from "lucide-react";

export const Route = createFileRoute("/_authenticated/notices")({ component: NoticesPage });

const CATS = ["all","academic","examination","placement","internship","holiday","emergency","general"] as const;

const CAT_COLOR: Record<string, string> = {
  academic: "bg-info/15 text-info",
  examination: "bg-warning/15 text-warning-foreground",
  placement: "bg-success/15 text-success",
  internship: "bg-primary/15 text-primary",
  emergency: "bg-destructive/15 text-destructive",
  holiday: "bg-accent text-accent-foreground",
  general: "bg-secondary text-secondary-foreground",
};

function NoticesPage() {
  const [cat, setCat] = useState<string>("all");
  const { data = [] } = useQuery({
    queryKey: ["notices", cat],
    queryFn: async () => {
      let q = supabase.from("notices").select("*").order("is_pinned",{ascending:false}).order("created_at",{ascending:false});
      if (cat !== "all") q = q.eq("category", cat as any);
      const { data } = await q;
      return data ?? [];
    },
  });

  return (
    <PageShell>
      <PageHeader title="Notice Board" description="Academic, placement and campus announcements." />
      <div className="mb-5 flex flex-wrap gap-1.5">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${cat === c ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-accent"}`}>
            {c}
          </button>
        ))}
      </div>
      {data.length === 0 ? <EmptyState title="No notices" icon={Bell} /> : (
        <div className="space-y-3">
          {data.map((n: any) => (
            <Card key={n.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {n.is_pinned && <Pin className="h-3.5 w-3.5 text-primary" />}
                    <Badge className={`capitalize ${CAT_COLOR[n.category] ?? ""}`} variant="secondary">{n.category}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</span>
                  </div>
                  <h3 className="mt-2 font-semibold">{n.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{n.description}</p>
                  {n.attachment_url && <a href={n.attachment_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-medium text-primary hover:underline">Download attachment →</a>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
