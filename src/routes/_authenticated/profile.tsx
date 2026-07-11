import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/lib/page-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({ component: ProfilePage });

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [p, setP] = useState<any>({});

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      setP(data ?? { id: user.id, email: user.email });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: p.full_name, phone: p.phone, enrollment_no: p.enrollment_no, branch: p.branch,
      year: p.year, semester: p.semester, cgpa: p.cgpa,
      skills: typeof p.skills === "string" ? p.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : p.skills,
      resume_url: p.resume_url, linkedin_url: p.linkedin_url, github_url: p.github_url, bio: p.bio,
    } as any).eq("id", p.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile updated");
  };

  if (loading) return <PageShell><div>Loading…</div></PageShell>;

  const initials = (p.full_name ?? "U").split(" ").map((s: string) => s[0]).slice(0,2).join("");
  const skillsStr = Array.isArray(p.skills) ? p.skills.join(", ") : (p.skills ?? "");

  return (
    <PageShell>
      <PageHeader title="Your Profile" description="Keep your academic and career info up to date." />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="p-6 text-center">
          <Avatar className="mx-auto h-24 w-24">
            {p.avatar_url && <AvatarImage src={p.avatar_url} />}
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="mt-4 font-bold text-lg">{p.full_name}</div>
          <div className="text-sm text-muted-foreground">{p.email}</div>
          {p.enrollment_no && <div className="mt-3 text-xs text-muted-foreground">Enrollment: <span className="font-medium text-foreground">{p.enrollment_no}</span></div>}
        </Card>

        <Card className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" v={p.full_name} onChange={(v) => setP({ ...p, full_name: v })} />
            <Field label="Phone" v={p.phone} onChange={(v) => setP({ ...p, phone: v })} />
            <Field label="Enrollment no." v={p.enrollment_no} onChange={(v) => setP({ ...p, enrollment_no: v })} />
            <Field label="Branch" v={p.branch} onChange={(v) => setP({ ...p, branch: v })} placeholder="e.g. CSE" />
            <Field label="Year" type="number" v={p.year} onChange={(v) => setP({ ...p, year: Number(v) || null })} />
            <Field label="Semester" type="number" v={p.semester} onChange={(v) => setP({ ...p, semester: Number(v) || null })} />
            <Field label="CGPA" type="number" v={p.cgpa} onChange={(v) => setP({ ...p, cgpa: Number(v) || null })} />
            <Field label="Resume URL" v={p.resume_url} onChange={(v) => setP({ ...p, resume_url: v })} />
            <Field label="LinkedIn" v={p.linkedin_url} onChange={(v) => setP({ ...p, linkedin_url: v })} />
            <Field label="GitHub" v={p.github_url} onChange={(v) => setP({ ...p, github_url: v })} />
          </div>
          <div>
            <Label>Skills (comma separated)</Label>
            <Input value={skillsStr} onChange={(e) => setP({ ...p, skills: e.target.value })} placeholder="React, Node.js, Python" />
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea rows={3} value={p.bio ?? ""} onChange={(e) => setP({ ...p, bio: e.target.value })} placeholder="A short intro about you" />
          </div>
          <Button onClick={save} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save changes</Button>
        </Card>
      </div>
    </PageShell>
  );
}

function Field({ label, v, onChange, type = "text", placeholder }: any) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={v ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
