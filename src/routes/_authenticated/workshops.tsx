import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader, EmptyState } from "@/lib/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, MapPin, User } from "lucide-react";
import { registerFor } from "@/lib/registrations";

export const Route = createFileRoute("/_authenticated/workshops")({ component: WorkshopsPage });

function WorkshopsPage() {
  const { data = [] } = useQuery({
    queryKey: ["workshops"],
    queryFn: async () => (await supabase.from("workshops").select("*").order("workshop_date")).data ?? [],
  });

  return (
    <PageShell>
      <PageHeader title="Workshops" description="Hands-on sessions from industry practitioners & alumni." />
      {data.length === 0 ? (
        <EmptyState title="No workshops scheduled" icon={BookOpen} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {data.map((w: any) => (
            <Card key={w.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="secondary">Workshop</Badge>
                  <h3 className="mt-2 text-lg font-semibold">{w.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{w.description}</p>
                </div>
                {w.certificate_available && <Badge className="bg-success text-success-foreground shrink-0">Certificate</Badge>}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><User className="h-3 w-3" />{w.speaker ?? "TBA"}</div>
                <div className="flex items-center gap-2"><Clock className="h-3 w-3" />{new Date(w.workshop_date).toLocaleDateString()}</div>
                {w.venue && <div className="flex items-center gap-2"><MapPin className="h-3 w-3" />{w.venue}</div>}
                {w.duration_hours && <div>{w.duration_hours}h duration</div>}
              </div>
              <Button className="mt-4 w-full" onClick={() => registerFor("workshop", w.id, w.title)}>Register</Button>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
