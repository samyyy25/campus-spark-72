import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader, EmptyState } from "@/lib/page-shell";
import { Card } from "@/components/ui/card";
import { Award, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated/certificates")({ component: CertsPage });

function CertsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null)); }, []);
  const { data = [] } = useQuery({
    queryKey: ["certs", userId], enabled: !!userId,
    queryFn: async () => (await supabase.from("certificates").select("*").eq("user_id", userId!).order("issue_date",{ascending:false})).data ?? [],
  });

  return (
    <PageShell>
      <PageHeader title="Certificates" description="Achievements you've earned across campus activities." />
      {data.length === 0 ? <EmptyState title="No certificates yet" description="Complete workshops or place in competitions to earn certificates." icon={Award} /> : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.map((c: any) => (
            <Card key={c.id} className="overflow-hidden p-0">
              <div className="h-24 gradient-primary grid place-items-center">
                <Award className="h-10 w-10 text-primary-foreground" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold">{c.title}</h3>
                <div className="text-sm text-muted-foreground">{c.issuer}</div>
                <div className="mt-2 text-xs text-muted-foreground">Issued {new Date(c.issue_date).toLocaleDateString()}</div>
                {c.certificate_url && (
                  <a href={c.certificate_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    View certificate <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
