import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "super_admin" | "college_admin" | "faculty" | "student";

export function useRoles() {
  const q = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [] as AppRole[];
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
      return (data ?? []).map((r) => r.role as AppRole);
    },
    staleTime: 60_000,
  });
  const roles = q.data ?? [];
  return {
    roles,
    isLoading: q.isLoading,
    isStaff: roles.some((r) => r === "super_admin" || r === "college_admin" || r === "faculty"),
    isAdmin: roles.some((r) => r === "super_admin" || r === "college_admin"),
  };
}
