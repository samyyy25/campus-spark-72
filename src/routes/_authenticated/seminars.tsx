import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader, EmptyState } from "@/lib/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Presentation, MapPin, Calendar as CalIcon } from "lucide-react";
import { registerFor } from "@/lib/registrations";

export const Route = createFileRoute("/_authenticated/seminars")({ component: SeminarsPage });

function SeminarsPage() {
  const { data = [] } = useQuery({
    queryKey: ["seminars"],
    queryFn: async () => (await supabase.from("seminars").select("*").order("seminar_date")).data ?? [],
  });
  return (
    <PageShell>
      <PageHeader title="Seminars & Guest Lectures" description="Learn directly from academic and industry leaders." />
      {data.length === 0 ? <EmptyState title="No seminars scheduled" icon={Presentation} /> : (
        <div className="grid gap-5 md:grid-cols-2">
          {data.map((s: any) => (
            <Card key={s.id} className="p-5">
              <Badge variant="outline">Seminar</Badge>
              <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
              <div className="mt-1 text-sm text-primary">{s.speaker} · {s.organization}</div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{s.description ?? s.topic}</p>
              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><CalIcon className="h-3 w-3" />{new Date(s.seminar_date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</div>
                {s.venue && <div className="flex items-center gap-2"><MapPin className="h-3 w-3" />{s.venue}</div>}
              </div>
              <Button className="mt-4 w-full" onClick={() => registerFor("seminar", s.id, s.title)}>Reserve seat</Button>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
