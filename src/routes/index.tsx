import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Calendar, Briefcase, GraduationCap, Users, Bell, Award, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg gradient-primary text-primary-foreground font-bold">S</div>
            <div className="leading-tight">
              <div className="text-sm font-bold">SRMCEM Portal</div>
              <div className="text-[10px] text-muted-foreground">Smart Campus OS</div>
            </div>
          </Link>
          <nav className="hidden gap-6 md:flex text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#modules" className="hover:text-foreground">Modules</a>
            <a href="#for-whom" className="hover:text-foreground">For whom</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/auth" search={{ mode: "signup" } as any}><Button size="sm">Get started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_50%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-28 text-primary-foreground">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Shri Ramswaroop Memorial College of Engineering & Management
            </span>
            <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-6xl">
              Every campus opportunity, <span className="opacity-90">one portal.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/85">
              Events, workshops, seminars, internships, placement drives, clubs, notices, certificates —
              discover, register and track your growth from a single, beautiful dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth" search={{ mode: "signup" } as any}>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Create student account <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                  Sign in
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-6 text-white/90">
              {[["12k+","Students"],["300+","Opportunities"],["50+","Partners"]].map(([n,l]) => (
                <div key={l}><div className="text-3xl font-bold">{n}</div><div className="text-xs uppercase tracking-wider">{l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Built like a professional platform</h2>
          <p className="mt-3 text-muted-foreground">LinkedIn-style discovery meets an Internshala-grade opportunity feed.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Calendar, t: "Events & Workshops", d: "Register, add to calendar, get reminders." },
            { i: Briefcase, t: "Internships & Placements", d: "Apply, upload resume, track status." },
            { i: Users, t: "Clubs & Community", d: "Join clubs, post events, build presence." },
            { i: Bell, t: "Notices & Alerts", d: "Never miss an academic or placement update." },
            { i: Award, t: "Certificates", d: "Verified certificates for every activity." },
            { i: GraduationCap, t: "Placement Readiness", d: "Track skill growth & participation score." },
            { i: Calendar, t: "Unified Calendar", d: "Academic, exam & event schedules." },
            { i: Sparkles, t: "Smart Recommendations", d: "Personalised opportunity feed." },
          ].map(({ i: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant">
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary text-primary-foreground"><Icon className="h-5 w-5" /></div>
              <h3 className="mt-4 font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules band */}
      <section id="modules" className="border-y bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-3">
          {[
            { t: "For Students", d: "Discover opportunities matched to your branch, year & skills. Register in one click." },
            { t: "For Faculty & TPO", d: "Publish drives, workshops & notices. Track registrations & performance." },
            { t: "For Admins", d: "Manage departments, clubs, calendars & get real-time analytics." },
          ].map((m) => (
            <div key={m.t} className="rounded-2xl bg-card p-8 shadow-card">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">{m.t}</div>
              <p className="mt-3 text-lg">{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="for-whom" className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Ready to unlock every campus opportunity?</h2>
        <p className="mt-4 text-muted-foreground">Join your peers at SRMCEM. Free for students, always.</p>
        <Link to="/auth" search={{ mode: "signup" } as any}>
          <Button size="lg" className="mt-8">Get started free <ArrowRight className="ml-1 h-4 w-4" /></Button>
        </Link>
      </section>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SRMCEM Portal · Shri Ramswaroop Memorial College of Engineering & Management
      </footer>
    </div>
  );
}
