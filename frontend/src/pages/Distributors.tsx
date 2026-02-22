import { distributors } from "@/data/mockData";
import {
  MapPin,
  Phone,
  User,
  Clock,
  TrendingUp,
  Package,
  Search,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { distributorsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const deliveries = [
  { product: "Cáo mùa xuân Sticker (×50)", batch: "STK-2025-001", distributor: "Konbini 30%", date: "2025-11-01", status: "delivered" },
  { product: "Fox Charm – Spring (×20)", batch: "CHM-2025-001", distributor: "Tinyde", date: "2025-11-05", status: "delivered" },
  { product: "Wagashi Sticker (×30)", batch: "STK-2025-005", distributor: "Shopee", date: "2025-11-10", status: "in-transit" },
  { product: "Gift Packaging Set (×100)", batch: "PKG-2025-001", distributor: "Vesta 40%", date: "2025-11-15", status: "pending" },
  { product: "Clay Fox Figurine (×5)", batch: "CLY-2025-001", distributor: "9Hearts 15", date: "2025-11-18", status: "pending" },
];

export default function Distributors() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", branch: "", commission: "", contact: "", phone: "" });
  const { toast } = useToast();

  const save = async () => {
    try {
      setSaving(true);
      await distributorsAPI.create({
        name: form.name,
        branch: form.branch,
        commission: form.commission ? Number(form.commission) : undefined,
        contact: form.contact,
        phone: form.phone,
      });
      toast({ title: "Distributor added" });
      setOpen(false);
      setForm({ name: "", branch: "", commission: "", contact: "", phone: "" });
    } catch (e: any) {
      toast({ title: "Failed to add distributor", description: e?.response?.data?.detail || "Check API" });
    } finally {
      setSaving(false);
    }
  };

  const filtered = distributors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.branch.toLowerCase().includes(search.toLowerCase()) ||
      d.contact.toLowerCase().includes(search.toLowerCase())
  );

  const selectedDist = distributors.find((d) => d.id === selected);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Distributors</h1>
        <p className="text-sm text-muted-foreground">
          Manage distributor profiles, deliveries and assignments
        </p>
      </div>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
        <Plus className="w-4 h-4" />
        Add Distributor
      </button>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Distributor List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search distributors..."
              className="w-full rounded-lg border border-border bg-muted pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            {filtered.map((dist) => (
              <button
                key={dist.id}
                onClick={() => setSelected(dist.id === selected ? null : dist.id)}
                className={`w-full rounded-xl p-4 text-left transition-all duration-200 border ${
                  selected === dist.id
                    ? "border-primary/50 bg-primary/10 glow-primary"
                    : "card-glass hover:border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{dist.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{dist.branch}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        dist.status === "active" ? "bg-success" : "bg-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        dist.status === "active" ? "text-success" : "text-muted-foreground"
                      }`}
                    >
                      {dist.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Package className="h-3 w-3" /> {dist.totalOrders} orders
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> {dist.commission}% comm.
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Distributor Detail */}
        <div className="lg:col-span-2 space-y-4">
          {selectedDist ? (
            <>
              {/* Profile Card */}
              <div className="card-glass rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedDist.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedDist.branch}</p>
                  </div>
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      selectedDist.status === "active"
                        ? "bg-success/15 text-success border border-success/30"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {selectedDist.status === "active" ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {selectedDist.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4">
                  {[
                    { label: "Total Orders", value: selectedDist.totalOrders },
                    { label: "Revenue", value: `${(selectedDist.revenue / 1000000).toFixed(1)}M đ` },
                    { label: "Commission", value: `${selectedDist.commission}%` },
                    { label: "Delivery Days", value: `${selectedDist.deliveryDays} days` },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-base font-bold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    {selectedDist.address}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4 shrink-0 text-accent" />
                    {selectedDist.contact}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0 text-success" />
                    {selectedDist.phone}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0 text-warning" />
                    Partner since {selectedDist.joinDate}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="card-glass rounded-xl flex h-40 items-center justify-center text-muted-foreground text-sm">
              ← Select a distributor to view details
            </div>
          )}

          {/* Delivery Timeline */}
          <div className="card-glass rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-4">
              Recent Product Deliveries
            </h2>
            <div className="space-y-3">
              {deliveries.map((d, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-2.5 w-2.5 rounded-full mt-1 ${
                        d.status === "delivered"
                          ? "bg-success"
                          : d.status === "in-transit"
                          ? "bg-primary"
                          : "bg-warning"
                      }`}
                    />
                    {i < deliveries.length - 1 && (
                      <div className="w-px flex-1 bg-border min-h-[20px]" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground">{d.product}</p>
                        <p className="text-xs text-muted-foreground">
                          {d.distributor} · Batch: {d.batch}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            d.status === "delivered"
                              ? "bg-success/15 text-success"
                              : d.status === "in-transit"
                              ? "bg-primary/15 text-primary"
                              : "bg-warning/15 text-warning"
                          }`}
                        >
                          {d.status}
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5">{d.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product-Distributor Table */}
          <div className="card-glass rounded-xl overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-base font-semibold text-foreground">
                Product–Distributor Assignments
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    {["Distributor", "Branch", "Commission", "Orders", "Revenue", "Status"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {distributors.map((d) => (
                    <tr key={d.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{d.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{d.branch}</td>
                      <td className="px-4 py-3 text-foreground">{d.commission}%</td>
                      <td className="px-4 py-3 font-mono text-foreground">{d.totalOrders}</td>
                      <td className="px-4 py-3 text-primary font-semibold">
                        {(d.revenue / 1000000).toFixed(1)}M đ
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            d.status === "active"
                              ? "bg-success/15 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="bg-background rounded-xl w-full max-w-lg mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-border text-base font-semibold">Add Distributor</div>
            <div className="p-5 space-y-3">
              <input className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Branch" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
                <input className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Commission %" value={form.commission} onChange={(e) => setForm({ ...form, commission: e.target.value })} />
              </div>
              <input className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
              <input className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="p-5 border-t border-border flex gap-2 justify-end">
              <button onClick={() => setOpen(false)} className="rounded-lg border border-border bg-muted px-4 py-2 text-sm">Cancel</button>
              <button disabled={saving} onClick={save} className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm">{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
