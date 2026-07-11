import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader, EmptyState } from "@/lib/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";

export const Route = createFileRoute("/_authenticated/calendar")({ component: CalendarPage });

type Item = { id: string; title: string; date: string; type: string; venue?: string | null };

function CalendarPage() {
  const { data = [] } = useQuery({
    queryKey: ["calendar-items"],
    queryFn: async (): Promise<Item[]> => {
      const [e, w, s, p] = await Promise.all([
        supabase.from("events").select("id,title,event_date,venue").gte("event_date", new Date().toISOString()),
        supabase.from("workshops").select("id,title,workshop_date,venue").gte("workshop_date", new Date().toISOString()),
        supabase.from("seminars").select("id,title,seminar_date,venue").gte("seminar_date", new Date().toISOString()),
        supabase.from("placement_drives").select("id,company_name,drive_date").not("drive_date","is",null),
      ]);
      const items: Item[] = [
        ...(e.data ?? []).map((x: any) => ({ id: x.id, title: x.title, date: x.event_date, type: "Event", venue: x.venue })),
        ...(w.data ?? []).map((x: any) => ({ id: x.id, title: x.title, date: x.workshop_date, type: "Workshop", venue: x.venue })),
        ...(s.data ?? []).map((x: any) => ({ id: x.id, title: x.title, date: x.seminar_date, type: "Seminar", venue: x.venue })),
        ...(p.data ?? []).map((x: any) => ({ id: x.id, title: `${x.company_name} Drive`, date: x.drive_date, type: "Placement" })),
      ];
      return items.sort((a, b) => a.date.localeCompare(b.date));
    },
  });

  const grouped = data.reduce<Record<string, Item[]>>((acc, it) => {
    const day = new Date(it.date).toDateString();
    (acc[day] ||= []).push(it); return acc;
  }, {});

  return (
    <PageShell>
      <PageHeader title="Campus Calendar" description="Every upcoming event, workshop, seminar and drive in one timeline." />
      {data.length === 0 ? <EmptyState title="Nothing scheduled" icon={CalendarDays} /> : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([day, items]) => (
            <div key={day}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{day}</div>
              <div className="space-y-2">
                {items.map((it) => (
                  <Card key={it.type + it.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary font-bold">
                        {new Date(it.date).getDate()}
                      </div>
                      <div>
                        <div className="font-medium">{it.title}</div>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                          <Badge variant="secondary">{it.type}</Badge>
                          <span>{new Date(it.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          {it.venue && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{it.venue}</span>}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
