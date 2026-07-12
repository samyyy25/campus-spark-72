import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Calendar, Briefcase, GraduationCap, Users, Bell, Award,
  User, ClipboardList, Presentation, BookOpen, CalendarDays, ShieldCheck,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { useRoles } from "@/hooks/use-roles";

const groups: { label: string; items: { title: string; url: string; icon: any }[] }[] = [
  { label: "Overview", items: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Calendar", url: "/calendar", icon: CalendarDays },
    { title: "My Activities", url: "/my-activities", icon: ClipboardList },
  ]},
  { label: "Opportunities", items: [
    { title: "Events", url: "/events", icon: Calendar },
    { title: "Workshops", url: "/workshops", icon: BookOpen },
    { title: "Seminars", url: "/seminars", icon: Presentation },
    { title: "Internships", url: "/internships", icon: Briefcase },
    { title: "Placements", url: "/placements", icon: GraduationCap },
  ]},
  { label: "Campus", items: [
    { title: "Clubs", url: "/clubs", icon: Users },
    { title: "Notices", url: "/notices", icon: Bell },
    { title: "Certificates", url: "/certificates", icon: Award },
    { title: "Profile", url: "/profile", icon: User },
  ]},
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { isStaff } = useRoles();

  const allGroups = isStaff
    ? [...groups, { label: "Staff", items: [{ title: "Admin Console", url: "/admin", icon: ShieldCheck }] }]
    : groups;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg gradient-primary font-bold text-primary-foreground">S</div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-bold">SRMCEM</div>
              <div className="text-[10px] text-muted-foreground">Campus Portal</div>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {allGroups.map((g) => (
          <SidebarGroup key={g.label}>
            {!collapsed && <SidebarGroupLabel>{g.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((it) => {
                  const active = pathname === it.url;
                  return (
                    <SidebarMenuItem key={it.url}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link to={it.url} className="flex items-center gap-2">
                          <it.icon className="h-4 w-4" />
                          {!collapsed && <span>{it.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
