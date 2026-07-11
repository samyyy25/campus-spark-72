import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader, EmptyState } from "@/lib/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, MapPin, IndianRupee, Clock, Search, ExternalLink } from "lucide-react";
import { registerFor } from "@/lib/registrations";

export const Route = createFileRoute("/_authenticated/internships")({ component: InternshipsPage });

function InternshipsPage() {
  const [q, setQ] = useState("");
  const { data = [] } = useQuery({
    queryKey: ["internships", q],
    queryFn: async () => {
      let query = supabase.from("internships").select("*").eq("status","published").order("created_at",{ascending:false});
      if (q) query = query.or(`role.ilike.%${q}%,company_name.ilike.%${q}%`);
      const { data } = await query;
      return data ?? [];
    },
  });

  return (
    <PageShell>
      <PageHeader title="Internships" description="Curated internship openings from top companies." />
      <div className="mb-5 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by role or company" className="pl-9" />
      </div>
      {data.length === 0 ? <EmptyState title="No internships posted yet" icon={Briefcase} /> : (
        <div className="space-y-4">
          {data.map((i: any) => (
            <Card key={i.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4 min-w-0 flex-1">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-secondary font-bold text-primary">
                    {i.logo_url ? <img src={i.logo_url} alt="" className="h-full w-full object-contain" /> : i.company_name[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold">{i.role}</h3>
                    <div className="text-sm text-muted-foreground">{i.company_name}</div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {i.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{i.location}</span>}
                      {i.stipend && <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />{i.stipend}</span>}
                      {i.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{i.duration}</span>}
                      {i.mode && <Badge variant="outline" className="capitalize">{i.mode}</Badge>}
                    </div>
                    {i.required_skills?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {i.required_skills.slice(0,6).map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {i.application_deadline && <div className="text-xs text-muted-foreground">Apply by {new Date(i.application_deadline).toLocaleDateString()}</div>}
                  <div className="flex gap-2">
                    {i.apply_link && <a href={i.apply_link} target="_blank" rel="noreferrer"><Button variant="outline" size="sm"><ExternalLink className="mr-1 h-3 w-3" />Apply</Button></a>}
                    <Button size="sm" onClick={() => registerFor("internship", i.id, i.role + " · " + i.company_name)}>Save & Track</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
