import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/lib/page-shell";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EntityManager, type FieldDef } from "@/components/admin/entity-manager";
import { Calendar, BookOpen, Presentation, Briefcase, GraduationCap, Bell, ShieldCheck, Loader2 } from "lucide-react";
import { useRoles } from "@/hooks/use-roles";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    const { data: isStaff } = await supabase.rpc("is_staff", { _user_id: data.user.id });
    if (!isStaff) throw redirect({ to: "/dashboard" });
  },
});

const STATUS = ["draft", "published", "closed", "cancelled"] as const;
const EVENT_CATS = ["technical", "cultural", "sports", "academic", "entrepreneurship", "innovation"] as const;
const NOTICE_CATS = ["academic", "examination", "placement", "internship", "holiday", "emergency", "general"] as const;
const MODES = ["onsite", "remote", "hybrid"] as const;

const eventFields: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "category", label: "Category", type: "select", options: EVENT_CATS, required: true },
  { name: "event_date", label: "Event date & time", type: "datetime", required: true },
  { name: "end_date", label: "End date & time", type: "datetime" },
  { name: "venue", label: "Venue", type: "text" },
  { name: "organizer", label: "Organizer", type: "text" },
  { name: "max_seats", label: "Max seats", type: "number" },
  { name: "registration_deadline", label: "Registration deadline", type: "datetime" },
  { name: "registration_link", label: "External registration link", type: "text" },
  { name: "banner_url", label: "Banner image URL", type: "text" },
  { name: "status", label: "Status", type: "select", options: STATUS },
  { name: "description", label: "Description", type: "textarea" },
];

const workshopFields: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "workshop_date", label: "Workshop date", type: "datetime", required: true },
  { name: "speaker", label: "Speaker / Instructor", type: "text" },
  { name: "company", label: "Company / Org", type: "text" },
  { name: "venue", label: "Venue", type: "text" },
  { name: "duration_hours", label: "Duration (hours)", type: "number" },
  { name: "max_seats", label: "Max seats", type: "number" },
  { name: "certificate_available", label: "Certificate available", type: "switch" },
  { name: "registration_link", label: "External registration link", type: "text" },
  { name: "banner_url", label: "Banner image URL", type: "text" },
  { name: "status", label: "Status", type: "select", options: STATUS },
  { name: "description", label: "Description", type: "textarea" },
];

const seminarFields: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "seminar_date", label: "Date & time", type: "datetime", required: true },
  { name: "speaker", label: "Speaker", type: "text" },
  { name: "organization", label: "Organization", type: "text" },
  { name: "topic", label: "Topic", type: "text" },
  { name: "venue", label: "Venue", type: "text" },
  { name: "capacity", label: "Capacity", type: "number" },
  { name: "registration_link", label: "External registration link", type: "text" },
  { name: "banner_url", label: "Banner image URL", type: "text" },
  { name: "status", label: "Status", type: "select", options: STATUS },
  { name: "description", label: "Description", type: "textarea" },
];

const internshipFields: FieldDef[] = [
  { name: "role", label: "Role", type: "text", required: true },
  { name: "company_name", label: "Company", type: "text", required: true },
  { name: "location", label: "Location", type: "text" },
  { name: "mode", label: "Mode", type: "select", options: MODES },
  { name: "stipend", label: "Stipend", type: "text", placeholder: "e.g. ₹25,000/mo" },
  { name: "duration", label: "Duration", type: "text", placeholder: "e.g. 3 months" },
  { name: "eligibility", label: "Eligibility", type: "text" },
  { name: "required_skills", label: "Required skills (comma separated)", type: "tags" },
  { name: "application_deadline", label: "Application deadline", type: "date" },
  { name: "apply_link", label: "Apply link", type: "text" },
  { name: "logo_url", label: "Company logo URL", type: "text" },
  { name: "status", label: "Status", type: "select", options: STATUS },
  { name: "description", label: "Description", type: "textarea" },
];

const placementFields: FieldDef[] = [
  { name: "company_name", label: "Company", type: "text", required: true },
  { name: "role", label: "Role", type: "text", required: true },
  { name: "package", label: "Package", type: "text", placeholder: "e.g. ₹12 LPA" },
  { name: "job_location", label: "Job location", type: "text" },
  { name: "eligibility", label: "Eligibility", type: "text" },
  { name: "selection_process", label: "Selection process", type: "text" },
  { name: "required_skills", label: "Required skills (comma separated)", type: "tags" },
  { name: "registration_deadline", label: "Registration deadline", type: "date" },
  { name: "drive_date", label: "Drive date", type: "date" },
  { name: "logo_url", label: "Company logo URL", type: "text" },
  { name: "status", label: "Status", type: "select", options: STATUS },
];

const noticeFields: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "category", label: "Category", type: "select", options: NOTICE_CATS, required: true },
  { name: "is_pinned", label: "Pin to top", type: "switch" },
  { name: "attachment_url", label: "Attachment URL", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
];

function AdminPage() {
  const { isStaff, isLoading } = useRoles();

  const counts = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const tables = ["events", "workshops", "seminars", "internships", "placement_drives", "notices"] as const;
      const out: Record<string, number> = {};
      await Promise.all(tables.map(async (t) => {
        const { count } = await supabase.from(t).select("id", { count: "exact", head: true });
        out[t] = count ?? 0;
      }));
      return out;
    },
  });

  if (isLoading) return <PageShell><div className="py-16 text-center text-muted-foreground"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div></PageShell>;
  if (!isStaff) return null;

  const stats = [
    { key: "events", label: "Events", icon: Calendar },
    { key: "workshops", label: "Workshops", icon: BookOpen },
    { key: "seminars", label: "Seminars", icon: Presentation },
    { key: "internships", label: "Internships", icon: Briefcase },
    { key: "placement_drives", label: "Placement drives", icon: GraduationCap },
    { key: "notices", label: "Notices", icon: Bell },
  ];

  return (
    <PageShell>
      <PageHeader
        title="Admin Console"
        description="Create, review and manage every opportunity published on the portal."
        actions={<span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success"><ShieldCheck className="h-3 w-3" />Staff access</span>}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.key} className="p-4">
            <div className="flex items-center justify-between text-muted-foreground">
              <s.icon className="h-4 w-4" />
              <span className="text-xs">{s.label}</span>
            </div>
            <div className="mt-2 text-2xl font-bold">{counts.data?.[s.key] ?? "—"}</div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="events">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="seminars">Seminars</TabsTrigger>
          <TabsTrigger value="internships">Internships</TabsTrigger>
          <TabsTrigger value="placements">Placements</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <EntityManager
            table="events" title="Events" description="Fests, hackathons and campus activities."
            emptyIcon={Calendar} fields={eventFields} orderBy={{ column: "event_date", ascending: false }}
            defaults={{ status: "published", category: "technical" }}
            renderRow={(r) => (
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground capitalize">{r.category} · {new Date(r.event_date).toLocaleString()} {r.venue && `· ${r.venue}`}</div>
              </div>
            )}
          />
        </TabsContent>
        <TabsContent value="workshops">
          <EntityManager
            table="workshops" title="Workshops" description="Hands-on skill-building sessions."
            emptyIcon={BookOpen} fields={workshopFields} orderBy={{ column: "workshop_date", ascending: false }}
            defaults={{ status: "published" }}
            renderRow={(r) => (
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{r.speaker ?? "TBA"} · {new Date(r.workshop_date).toLocaleDateString()} {r.venue && `· ${r.venue}`}</div>
              </div>
            )}
          />
        </TabsContent>
        <TabsContent value="seminars">
          <EntityManager
            table="seminars" title="Seminars" description="Guest lectures and expert talks."
            emptyIcon={Presentation} fields={seminarFields} orderBy={{ column: "seminar_date", ascending: false }}
            defaults={{ status: "published" }}
            renderRow={(r) => (
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{r.speaker} · {new Date(r.seminar_date).toLocaleString()} {r.venue && `· ${r.venue}`}</div>
              </div>
            )}
          />
        </TabsContent>
        <TabsContent value="internships">
          <EntityManager
            table="internships" title="Internships" description="Openings shared by partner companies."
            emptyIcon={Briefcase} fields={internshipFields} orderBy={{ column: "created_at", ascending: false }}
            defaults={{ status: "published", mode: "onsite" }}
            renderRow={(r) => (
              <div>
                <div className="font-medium">{r.role} · <span className="text-muted-foreground">{r.company_name}</span></div>
                <div className="mt-0.5 text-xs text-muted-foreground">{r.location ?? "—"} {r.stipend && `· ${r.stipend}`} {r.duration && `· ${r.duration}`}</div>
              </div>
            )}
          />
        </TabsContent>
        <TabsContent value="placements">
          <EntityManager
            table="placement_drives" title="Placement drives" description="Recruitment drives scheduled on campus."
            emptyIcon={GraduationCap} fields={placementFields} orderBy={{ column: "drive_date", ascending: false }}
            defaults={{ status: "published" }}
            renderRow={(r) => (
              <div>
                <div className="font-medium">{r.company_name} · <span className="text-muted-foreground">{r.role}</span></div>
                <div className="mt-0.5 text-xs text-muted-foreground">{r.package ?? "Package TBA"} {r.drive_date && `· Drive ${new Date(r.drive_date).toLocaleDateString()}`}</div>
              </div>
            )}
          />
        </TabsContent>
        <TabsContent value="notices">
          <EntityManager
            table="notices" title="Notices" description="Campus-wide announcements."
            emptyIcon={Bell} fields={noticeFields} orderBy={{ column: "created_at", ascending: false }}
            defaults={{ category: "general" }}
            renderRow={(r) => (
              <div>
                <div className="font-medium">{r.is_pinned ? "📌 " : ""}{r.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground capitalize">{r.category} · {new Date(r.created_at).toLocaleDateString()}</div>
              </div>
            )}
          />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
