import { useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Loader2, Pencil } from "lucide-react";
import { EmptyState } from "@/lib/page-shell";

export type FieldDef =
  | { name: string; label: string; type: "text" | "textarea" | "datetime" | "date" | "number"; required?: boolean; placeholder?: string }
  | { name: string; label: string; type: "switch" }
  | { name: string; label: string; type: "select"; options: readonly string[]; required?: boolean }
  | { name: string; label: string; type: "tags"; placeholder?: string };

type Props = {
  table: "events" | "workshops" | "seminars" | "internships" | "placement_drives" | "notices";
  title: string;
  description: string;
  emptyIcon: any;
  fields: FieldDef[];
  orderBy: { column: string; ascending?: boolean };
  renderRow: (row: any) => ReactNode;
  defaults?: Record<string, any>;
};

function initialValues(fields: FieldDef[], defaults?: Record<string, any>) {
  const v: Record<string, any> = { ...defaults };
  for (const f of fields) {
    if (f.name in v) continue;
    if (f.type === "switch") v[f.name] = false;
    else if (f.type === "tags") v[f.name] = "";
    else v[f.name] = "";
  }
  return v;
}

export function EntityManager({ table, title, description, emptyIcon: Icon, fields, orderBy, renderRow, defaults }: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, any>>(() => initialValues(fields, defaults));

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order(orderBy.column, { ascending: orderBy.ascending ?? false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const createMut = useMutation({
    mutationFn: async (payload: Record<string, any>) => {
      const { data: u } = await supabase.auth.getUser();
      const insert: Record<string, any> = { ...payload, created_by: u.user?.id ?? null };
      const { error } = await supabase.from(table).insert(insert as any);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`${title.replace(/s$/, "")} created`);
      qc.invalidateQueries({ queryKey: ["admin", table] });
      qc.invalidateQueries({ queryKey: [table] });
      setValues(initialValues(fields, defaults));
      setOpen(false);
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to create"),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", table] });
      qc.invalidateQueries({ queryKey: [table] });
    },
    onError: (e: any) => toast.error(e.message ?? "Delete failed"),
  });

  function submit() {
    const payload: Record<string, any> = {};
    for (const f of fields) {
      const raw = values[f.name];
      if (f.type === "tags") {
        const arr = String(raw ?? "").split(",").map((s) => s.trim()).filter(Boolean);
        payload[f.name] = arr.length ? arr : null;
      } else if (f.type === "number") {
        payload[f.name] = raw === "" || raw == null ? null : Number(raw);
      } else if (f.type === "switch") {
        payload[f.name] = !!raw;
      } else if (f.type === "datetime" || f.type === "date") {
        payload[f.name] = raw ? new Date(raw).toISOString() : null;
      } else {
        if ("required" in f && f.required && !String(raw ?? "").trim()) {
          toast.error(`${f.label} is required`);
          return;
        }
        payload[f.name] = raw === "" ? null : raw;
      }
    }
    createMut.mutate(payload);
  }

  return (
    <Card className="p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-1 h-4 w-4" />New {title.replace(/s$/, "")}</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader><DialogTitle>Create {title.replace(/s$/, "")}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <Label className="mb-1.5 block text-xs font-medium">{f.label}{"required" in f && f.required && <span className="text-destructive"> *</span>}</Label>
                  {f.type === "textarea" ? (
                    <Textarea rows={3} value={values[f.name] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))} />
                  ) : f.type === "select" ? (
                    <Select value={values[f.name] ?? ""} onValueChange={(val) => setValues((v) => ({ ...v, [f.name]: val }))}>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>{f.options.map((o) => <SelectItem key={o} value={o} className="capitalize">{o}</SelectItem>)}</SelectContent>
                    </Select>
                  ) : f.type === "switch" ? (
                    <div className="flex h-9 items-center"><Switch checked={!!values[f.name]} onCheckedChange={(c) => setValues((v) => ({ ...v, [f.name]: c }))} /></div>
                  ) : (
                    <Input
                      type={f.type === "datetime" ? "datetime-local" : f.type === "date" ? "date" : f.type === "number" ? "number" : "text"}
                      placeholder={"placeholder" in f ? f.placeholder : ""}
                      value={values[f.name] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit} disabled={createMut.isPending}>
                {createMut.isPending && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-sm text-muted-foreground"><Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />Loading…</div>
      ) : data.length === 0 ? (
        <EmptyState title={`No ${title.toLowerCase()} yet`} description="Click the button above to create the first one." icon={Icon} />
      ) : (
        <div className="divide-y rounded-lg border">
          {data.map((row: any) => (
            <div key={row.id} className="flex items-start justify-between gap-3 p-4 hover:bg-secondary/30">
              <div className="min-w-0 flex-1">{renderRow(row)}</div>
              <div className="flex shrink-0 items-center gap-2">
                {row.status && <Badge variant="outline" className="capitalize">{row.status}</Badge>}
                <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete this item?")) deleteMut.mutate(row.id); }}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
