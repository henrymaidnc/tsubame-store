import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { materialsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface MaterialForm {
  name: string;
  unit: string;
  stock: string;
  cost_per_unit: string;
}

export default function Materials() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<MaterialForm>({ name: "", unit: "", stock: "", cost_per_unit: "" });
  const [loading, setLoading] = useState(false);

  const save = async () => {
    try {
      setLoading(true);
      await materialsAPI.create({
        name: form.name,
        unit: form.unit,
        stock: Number(form.stock || 0),
        cost_per_unit: Number(form.cost_per_unit || 0),
      });
      toast({ title: "Material added" });
      setOpen(false);
      setForm({ name: "", unit: "", stock: "", cost_per_unit: "" });
    } catch (e: any) {
      toast({ title: "Failed to add material", description: e?.response?.data?.detail || "Check API" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Materials</h1>
          <p className="text-sm text-muted-foreground">Manage material inventory</p>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Add Material
        </button>
      </div>

      <div className="card-glass rounded-xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search materials..."
            className="w-full rounded-lg border border-border bg-muted pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div className="py-10 text-center text-muted-foreground text-sm">No materials listed. Use “Add Material”.</div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="bg-background rounded-xl w-full max-w-lg mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-border text-base font-semibold">Add Material</div>
            <div className="p-5 space-y-3">
              <input className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Unit (e.g., pcs)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                <input className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <input className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Cost per unit" value={form.cost_per_unit} onChange={(e) => setForm({ ...form, cost_per_unit: e.target.value })} />
            </div>
            <div className="p-5 border-t border-border flex gap-2 justify-end">
              <button onClick={() => setOpen(false)} className="rounded-lg border border-border bg-muted px-4 py-2 text-sm">Cancel</button>
              <button disabled={loading} onClick={save} className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm">{loading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
