import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader, EmptyState } from "@/lib/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/clubs")({ component: ClubsPage });

function ClubsPage() {
  const qc = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null)); }, []);

  const { data: clubs = [] } = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => (await supabase.from("clubs").select("*").order("name")).data ?? [],
  });
  const { data: memberships = [] } = useQuery({
    queryKey: ["club_members", userId],
    enabled: !!userId,
    queryFn: async () => (await supabase.from("club_members").select("club_id").eq("user_id", userId!)).data ?? [],
  });
  const joined = new Set(memberships.map((m: any) => m.club_id));

  const toggle = async (clubId: string, isJoined: boolean) => {
    if (!userId) return;
    if (isJoined) {
      await supabase.from("club_members").delete().eq("user_id", userId).eq("club_id", clubId);
      toast.success("Left club");
    } else {
      const { error } = await supabase.from("club_members").insert({ user_id: userId, club_id: clubId } as any);
      if (error) { toast.error(error.message); return; }
      toast.success("Joined club!");
    }
    qc.invalidateQueries({ queryKey: ["club_members"] });
  };

  return (
    <PageShell>
      <PageHeader title="Clubs & Communities" description="Find your tribe — coding, robotics, culture, sports & more." />
      {clubs.length === 0 ? <EmptyState title="No clubs yet" icon={Users} /> : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((c: any) => {
            const isJoined = joined.has(c.id);
            return (
              <Card key={c.id} className="overflow-hidden p-0">
                <div className="h-24 gradient-primary" />
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{c.name}</h3>
                    {c.category && <Badge variant="secondary" className="capitalize">{c.category}</Badge>}
                  </div>
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{c.description}</p>
                  <Button variant={isJoined ? "outline" : "default"} className="mt-4 w-full" onClick={() => toggle(c.id, isJoined)}>
                    {isJoined ? "Leave club" : "Join club"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
