import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { materialsAPI, type Material } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface MaterialForm {
  name: string;
  unit: string;
  quantity: string;
  min_stock_level: string;
  status: string;
  price: string;
}

export default function Materials() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [form, setForm] = useState<MaterialForm>({
    name: "",
    unit: "",
    quantity: "",
    min_stock_level: "",
    status: "active",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  const loadMaterials = async () => {
    try {
      setBusy(true);
      const data = await materialsAPI.getAll();
      setMaterials(data);
    } finally {
      setBusy(false);
    }
  };

  const filtered = materials.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.unit.toLowerCase().includes(q) ||
      String(m.quantity).includes(q) ||
      String(m.price).includes(q) ||
      m.status.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    loadMaterials();
  }, []);

  const toMessage = (err: any): string => {
    const detail = err?.response?.data?.detail;
    if (!detail) return "Check API";
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      const msgs = detail.map((d: any) => d?.msg ?? JSON.stringify(d)).join("; ");
      return msgs || "Validation error";
    }
    if (typeof detail === "object") {
      return detail?.msg || JSON.stringify(detail);
    }
    return String(detail);
  };

  const save = async () => {
    try {
      setLoading(true);
      await materialsAPI.create({
        name: form.name,
        unit: form.unit,
        quantity: Number(form.quantity || 0),
        min_stock_level: Number(form.min_stock_level || 0),
        status: form.status || "active",
        price: Number(form.price || 0),
      });
      toast({ title: "Material added" });
      setOpen(false);
      setForm({ name: "", unit: "", quantity: "", min_stock_level: "", status: "active", price: "" });
      await loadMaterials();
    } catch (e: any) {
      toast({ title: "Failed to add material", description: toMessage(e) });
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
        {busy ? (
          <div className="py-10 text-center text-muted-foreground text-sm">Loading materials…</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground text-sm">No materials listed. Use “Add Material”.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Unit</th>
                  <th className="py-2 px-3">Qty</th>
                  <th className="py-2 px-3">Min</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-t border-border">
                    <td className="py-2 px-3 text-foreground">{m.name}</td>
                    <td className="py-2 px-3">{m.unit}</td>
                    <td className="py-2 px-3">{m.quantity}</td>
                    <td className="py-2 px-3">{m.min_stock_level}</td>
                    <td className="py-2 px-3">{m.status}</td>
                    <td className="py-2 px-3">{m.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="bg-background rounded-xl w-full max-w-lg mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-border text-base font-semibold">Add Material</div>
            <div className="p-5 space-y-3">
              <input className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Unit (e.g., pcs)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                <input className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Min Stock Level" value={form.min_stock_level} onChange={(e) => setForm({ ...form, min_stock_level: e.target.value })} />
                <input className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Status (e.g., active)" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
              </div>
              <input className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
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
