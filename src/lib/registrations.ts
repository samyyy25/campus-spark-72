import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ActivityType = "event" | "workshop" | "seminar" | "internship" | "placement" | "club";

export async function registerFor(type: ActivityType, id: string, title: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { toast.error("Please sign in"); return false; }
  const { error } = await supabase.from("registrations").insert({
    user_id: user.id, activity_type: type, activity_id: id, status: "registered",
  } as any);
  if (error) {
    if (error.code === "23505") toast.info("You're already registered.");
    else toast.error(error.message);
    return false;
  }
  await supabase.from("notifications").insert({
    user_id: user.id, title: "Registration confirmed", message: `You registered for “${title}”.`,
  } as any);
  toast.success("Registered! Check My Activities.");
  return true;
}

export async function myRegistrations() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase.from("registrations").select("*").eq("user_id", user.id);
  return data ?? [];
}
