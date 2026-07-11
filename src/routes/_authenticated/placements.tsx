import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader, EmptyState } from "@/lib/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, Package } from "lucide-react";
import { registerFor } from "@/lib/registrations";

export const Route = createFileRoute("/_authenticated/placements")({ component: PlacementsPage });

function PlacementsPage() {
  const { data = [] } = useQuery({
    queryKey: ["placements"],
    queryFn: async () => (await supabase.from("placement_drives").select("*").eq("status","published").order("drive_date")).data ?? [],
  });
  return (
    <PageShell>
      <PageHeader title="Placement Drives" description="Register early, prepare well, land the offer." />
      {data.length === 0 ? <EmptyState title="No placement drives yet" icon={GraduationCap} /> : (
        <div className="grid gap-5 md:grid-cols-2">
          {data.map((p: any) => (
            <Card key={p.id} className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">Placement Drive</div>
                  <h3 className="mt-1 text-lg font-bold">{p.company_name}</h3>
                  <div className="text-sm text-muted-foreground">{p.role}</div>
                </div>
                {p.package && <div className="rounded-lg bg-success/10 px-3 py-1.5 text-sm font-bold text-success">{p.package}</div>}
              </div>
              <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                {p.job_location && <div className="flex items-center gap-2"><MapPin className="h-3 w-3" />{p.job_location}</div>}
                {p.eligibility && <div><span className="font-medium text-foreground">Eligibility:</span> {p.eligibility}</div>}
                {p.selection_process && <div><span className="font-medium text-foreground">Process:</span> {p.selection_process}</div>}
                <div className="flex gap-4 pt-1">
                  {p.registration_deadline && <span>Register by <span className="font-medium text-foreground">{new Date(p.registration_deadline).toLocaleDateString()}</span></span>}
                  {p.drive_date && <span>Drive <span className="font-medium text-foreground">{new Date(p.drive_date).toLocaleDateString()}</span></span>}
                </div>
              </div>
              {p.required_skills?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.required_skills.slice(0,8).map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>)}
                </div>
              )}
              <Button className="mt-4 w-full" onClick={() => registerFor("placement", p.id, p.company_name)}>Register for drive</Button>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
