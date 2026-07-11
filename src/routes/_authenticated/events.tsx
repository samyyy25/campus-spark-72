import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader, EmptyState } from "@/lib/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalIcon, MapPin, Users, Search } from "lucide-react";
import { registerFor } from "@/lib/registrations";

export const Route = createFileRoute("/_authenticated/events")({ component: EventsPage });

const CATS = ["all","technical","cultural","sports","academic","entrepreneurship","innovation"] as const;

function EventsPage() {
  const [q, setQ] = useState(""); const [cat, setCat] = useState<string>("all");
  const { data = [] } = useQuery({
    queryKey: ["events", cat, q],
    queryFn: async () => {
      let query = supabase.from("events").select("*").order("event_date");
      if (cat !== "all") query = query.eq("category", cat as any);
      if (q) query = query.ilike("title", `%${q}%`);
      const { data } = await query;
      return data ?? [];
    },
  });

  return (
    <PageShell>
      <PageHeader title="Events" description="Discover technical fests, cultural nights, sports meets and more." />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events…" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${cat === c ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-accent"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState title="No events found" description="Check back soon or try a different filter." icon={CalIcon} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((e: any) => (
            <Card key={e.id} className="overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-elegant">
              <div className="h-32 gradient-primary relative">
                {e.banner_url && <img src={e.banner_url} alt="" className="h-full w-full object-cover opacity-90" />}
                <Badge className="absolute left-3 top-3 capitalize bg-white/90 text-foreground">{e.category}</Badge>
              </div>
              <div className="p-5">
                <h3 className="font-semibold">{e.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><CalIcon className="h-3 w-3" />{new Date(e.event_date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</div>
                  {e.venue && <div className="flex items-center gap-2"><MapPin className="h-3 w-3" />{e.venue}</div>}
                  {e.max_seats && <div className="flex items-center gap-2"><Users className="h-3 w-3" />{e.max_seats} seats</div>}
                </div>
                <Button className="mt-4 w-full" onClick={() => registerFor("event", e.id, e.title)}>Register</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
