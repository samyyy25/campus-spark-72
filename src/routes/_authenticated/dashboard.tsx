import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/lib/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Briefcase, Award, ClipboardList, BookOpen, GraduationCap, Bell, ArrowRight, TrendingUp } from "lucide-react";
import { Suspense } from "react";

const dashQO = () => queryOptions({
  queryKey: ["dashboard"],
  queryFn: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const [events, workshops, internships, placements, notices, regs, certs] = await Promise.all([
      supabase.from("events").select("id,title,event_date,venue,category,banner_url").gte("event_date", new Date().toISOString()).order("event_date").limit(4),
      supabase.from("workshops").select("id,title,workshop_date,speaker").gte("workshop_date", new Date().toISOString()).order("workshop_date").limit(3),
      supabase.from("internships").select("id,company_name,role,stipend,application_deadline").eq("status","published").order("created_at",{ascending:false}).limit(3),
      supabase.from("placement_drives").select("id,company_name,role,package,drive_date").eq("status","published").order("drive_date").limit(3),
      supabase.from("notices").select("id,title,category,created_at").order("created_at",{ascending:false}).limit(4),
      user ? supabase.from("registrations").select("id,activity_type,status").eq("user_id", user.id) : Promise.resolve({ data: [] }),
      user ? supabase.from("certificates").select("id").eq("user_id", user.id) : Promise.resolve({ data: [] }),
    ]);
    return {
      events: events.data ?? [], workshops: workshops.data ?? [], internships: internships.data ?? [],
      placements: placements.data ?? [], notices: notices.data ?? [],
      regsCount: regs.data?.length ?? 0, certsCount: certs.data?.length ?? 0,
      userName: user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Student",
    };
  },
});

export const Route = createFileRoute("/_authenticated/dashboard")({
  loader: ({ context }) => { context.queryClient.ensureQueryData(dashQO()); },
  component: () => <Suspense fallback={<div className="p-6">Loading…</div>}><Dashboard /></Suspense>,
});

function Dashboard() {
  const { data: d } = useSuspenseQuery(dashQO());
  const stats = [
    { l: "Upcoming Events", v: d.events.length, i: Calendar, c: "text-info" },
    { l: "Active Workshops", v: d.workshops.length, i: BookOpen, c: "text-primary" },
    { l: "Internships", v: d.internships.length, i: Briefcase, c: "text-warning" },
    { l: "Placement Drives", v: d.placements.length, i: GraduationCap, c: "text-success" },
    { l: "My Registrations", v: d.regsCount, i: ClipboardList, c: "text-primary" },
    { l: "Certificates", v: d.certsCount, i: Award, c: "text-info" },
  ];

  return (
    <PageShell>
      <div className="mb-6 overflow-hidden rounded-2xl gradient-hero p-8 text-primary-foreground shadow-elegant">
        <div className="text-xs font-medium uppercase tracking-wider opacity-80">Welcome back</div>
        <h1 className="mt-1 text-3xl font-bold">Hi {d.userName} 👋</h1>
        <p className="mt-2 max-w-xl text-white/85">Here's what's happening at SRMCEM this week — new events, internships & placement drives are live.</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.l} className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-muted-foreground">{s.l}</div>
              <s.i className={`h-4 w-4 ${s.c}`} />
            </div>
            <div className="mt-2 text-3xl font-bold">{s.v}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Events */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Upcoming Events" to="/events" icon={Calendar}>
            <div className="grid gap-3 sm:grid-cols-2">
              {d.events.length === 0 && <EmptyMini text="No upcoming events" />}
              {d.events.map((e: any) => (
                <Link key={e.id} to="/events" className="group rounded-xl border bg-card p-4 transition hover:shadow-card">
                  <Badge variant="secondary" className="capitalize">{e.category}</Badge>
                  <div className="mt-2 font-semibold group-hover:text-primary">{e.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{new Date(e.event_date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })} · {e.venue ?? "TBA"}</div>
                </Link>
              ))}
            </div>
          </Section>

          <Section title="Placement Drives" to="/placements" icon={GraduationCap}>
            <div className="divide-y rounded-xl border bg-card">
              {d.placements.length === 0 && <div className="p-6"><EmptyMini text="No drives scheduled" /></div>}
              {d.placements.map((p: any) => (
                <Link key={p.id} to="/placements" className="flex items-center justify-between p-4 hover:bg-accent/40">
                  <div>
                    <div className="font-semibold">{p.company_name} · <span className="font-normal text-muted-foreground">{p.role}</span></div>
                    <div className="text-xs text-muted-foreground">{p.package ? `Package: ${p.package}` : "Package TBA"} · Drive {p.drive_date ? new Date(p.drive_date).toLocaleDateString() : "TBA"}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </Section>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          <Section title="Notices" to="/notices" icon={Bell}>
            <div className="space-y-2">
              {d.notices.length === 0 && <EmptyMini text="No notices yet" />}
              {d.notices.map((n: any) => (
                <Link key={n.id} to="/notices" className="block rounded-lg border bg-card p-3 hover:bg-accent/40">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] capitalize">{n.category}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-1 text-sm font-medium">{n.title}</div>
                </Link>
              ))}
            </div>
          </Section>

          <Section title="Fresh Internships" to="/internships" icon={Briefcase}>
            <div className="space-y-2">
              {d.internships.length === 0 && <EmptyMini text="No internships live" />}
              {d.internships.map((i: any) => (
                <Link key={i.id} to="/internships" className="block rounded-lg border bg-card p-3 hover:bg-accent/40">
                  <div className="text-sm font-semibold">{i.role}</div>
                  <div className="text-xs text-muted-foreground">{i.company_name} · {i.stipend ?? "Stipend TBA"}</div>
                </Link>
              ))}
            </div>
          </Section>

          <Card className="p-5 gradient-primary text-primary-foreground">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider opacity-80"><TrendingUp className="h-4 w-4" /> Placement Readiness</div>
            <div className="mt-2 text-4xl font-bold">{Math.min(100, 40 + d.regsCount * 8 + d.certsCount * 5)}%</div>
            <p className="mt-1 text-xs text-white/85">Attend workshops & complete internships to boost your score.</p>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

function Section({ title, to, icon: Icon, children }: any) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold"><Icon className="h-4 w-4 text-primary" />{title}</h2>
        <Link to={to} className="text-xs font-medium text-primary hover:underline">View all →</Link>
      </div>
      {children}
    </div>
  );
}
function EmptyMini({ text }: { text: string }) { return <div className="text-sm text-muted-foreground">{text}</div>; }
