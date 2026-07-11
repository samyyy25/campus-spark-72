import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Notif = { id: string; title: string; message: string | null; is_read: boolean | null; created_at: string; link: string | null };

export function NotificationsBell() {
  const [items, setItems] = useState<Notif[]>([]);
  const unread = items.filter((n) => !n.is_read).length;

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10);
      setItems((data as any) ?? []);
    })();
  }, []);

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id);
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">{unread}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b p-3">
          <div className="text-sm font-semibold">Notifications</div>
          {unread > 0 && <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>}
        </div>
        <div className="max-h-80 overflow-auto">
          {items.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">You're all caught up 🎉</div>}
          {items.map((n) => (
            <div key={n.id} className={`border-b p-3 text-sm ${!n.is_read ? "bg-accent/30" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium">{n.title}</div>
                {!n.is_read && <Badge variant="secondary" className="text-[9px]">NEW</Badge>}
              </div>
              {n.message && <div className="mt-0.5 text-xs text-muted-foreground">{n.message}</div>}
              <div className="mt-1 text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
