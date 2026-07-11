import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader, EmptyState } from "@/lib/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";

export const Route = createFileRoute("/_authenticated/my-activities")({ component: MyActivities });

const TABLE_MAP: Record<string, { table: string; titleField: string; dateField?: string }> = {
  event: { table: "events", titleField: "title", dateField: "event_date" },
  workshop: { table: "workshops", titleField: "title", dateField: "workshop_date" },
  seminar: { table: "seminars", titleField: "title", dateField: "seminar_date" },
  internship: { table: "internships", titleField: "role" },
  placement: { table: "placement_drives", titleField: "company_name", dateField: "drive_date" },
};

function MyActivities() {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null)); }, []);

  const { data = [] } = useQuery({
    queryKey: ["my-activities", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data: regs } = await supabase.from("registrations").select("*").eq("user_id", userId!).order("created_at",{ascending:false});
      if (!regs) return [];
      const enriched = await Promise.all(regs.map(async (r: any) => {
        const meta = TABLE_MAP[r.activity_type as string];
        if (!meta) return { ...r, title: "Activity" };
        const { data: item } = await supabase.from(meta.table as any).select("*").eq("id", r.activity_id).maybeSingle();
        const it = item as Record<string, any> | null;
        return { ...r, item: it, title: it?.[meta.titleField] ?? "Untitled", date: meta.dateField ? it?.[meta.dateField] : null };
      }));
      return enriched;
    },
  });

  return (
    <PageShell>
      <PageHeader title="My Activities" description="Everything you've registered for, all in one place." />
      {data.length === 0 ? <EmptyState title="Nothing here yet" description="Browse opportunities and register." icon={ClipboardList} /> : (
        <div className="space-y-3">
          {data.map((r: any) => (
            <Card key={r.id} className="flex items-center justify-between p-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">{r.activity_type}</Badge>
                  <Badge className="capitalize" variant={r.status === "selected" ? "default" : "outline"}>{r.status}</Badge>
                </div>
                <div className="mt-1.5 font-medium">{r.title}</div>
                {r.date && <div className="text-xs text-muted-foreground">{new Date(r.date).toLocaleString()}</div>}
              </div>
              <div className="text-xs text-muted-foreground">Registered {new Date(r.created_at).toLocaleDateString()}</div>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
