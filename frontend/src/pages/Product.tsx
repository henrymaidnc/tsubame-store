import { useState, useEffect } from "react";
import { Search, X, ShoppingCart, Info, Plus } from "lucide-react";
import { productsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type Status = "in-stock" | "low-stock" | "out-of-stock";

const statusConfig: Record<Status, { label: string; className: string }> = {
  "in-stock": { label: "In Stock", className: "status-in-stock" },
  "low-stock": { label: "Low Stock", className: "status-low-stock" },
  "out-of-stock": { label: "Out of Stock", className: "status-out-of-stock" },
};

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under 35,000đ", min: 0, max: 35000 },
  { label: "35,000 – 50,000đ", min: 35000, max: 50000 },
  { label: "50,000đ+", min: 50000, max: Infinity },
];

type CatalogProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  inventory?: { stock: number; status: string } | null;
};

function getStatus(p: CatalogProduct): Status {
  const stock = p.inventory?.stock ?? 0;
  if (stock > 20) return "in-stock";
  if (stock > 0) return "low-stock";
  return "out-of-stock";
}

export default function Product() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [quickView, setQuickView] = useState<CatalogProduct | null>(null);
  const [cart, setCart] = useState<number[]>([]);

  useEffect(() => {
    productsAPI
      .getAll()
      .then((data) => {
        setProducts(data);
        const cats = Array.from(new Set(data.map((p) => p.category)));
        setCategories(["All", ...cats]);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setCategories(["All"]);
        setLoading(false);
      });
  }, []);

  const range = priceRanges[priceRange];
  const filtered = products.filter((p) => {
    const matchSearch = (p.name ?? "").toLowerCase().includes(search.toLowerCase()) || (p.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    const matchPrice = p.price >= range.min && p.price <= range.max;
    const matchAvail = !availableOnly || getStatus(p) !== "out-of-stock";
    return matchSearch && matchCat && matchPrice && matchAvail;
  });

  const addToCart = (id: number) => setCart((prev) => [...prev, id]);
  const inCart = (id: number) => cart.includes(id);

  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", category: "", price: "", stock: "", distributor: "", image: "", description: "" });

  const saveProduct = async () => {
    try {
      setSaving(true);
      await productsAPI.create({
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price || 0),
        stock: Number(newProduct.stock || 0),
        distributor: newProduct.distributor,
        image: newProduct.image,
        description: newProduct.description,
        status: "in-stock",
        batch_number: "",
      } as any);
      toast({ title: "Product added" });
      setAddOpen(false);
      setNewProduct({ name: "", category: "", price: "", stock: "", distributor: "", image: "", description: "" });
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (e: any) {
      toast({ title: "Failed to add product", description: e?.response?.data?.detail || "Check API" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product</h1>
          <p className="text-sm text-muted-foreground">Browse and manage products</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
          {cart.length > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-primary/15 border border-primary/30 px-4 py-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">{cart.length} in cart</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-glass rounded-xl p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full rounded-lg border border-border bg-muted pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
            <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="accent-primary" />
            Available only
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${category === cat ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground bg-muted"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 ml-auto">
            {priceRanges.map((r, i) => (
              <button key={i} onClick={() => setPriceRange(i)} className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${priceRange === i ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground bg-muted"}`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted-foreground">Loading products…</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((product) => {
            const status = getStatus(product);
            const { label, className } = statusConfig[status];
            const outOfStock = status === "out-of-stock";
            return (
              <div key={product.id} className="card-glass rounded-xl overflow-hidden group hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] flex flex-col">
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>{label}</span>
                  <button onClick={() => setQuickView(product)} className="absolute bottom-2 right-2 rounded-full bg-card/80 backdrop-blur-sm p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/20">
                    <Info className="h-3.5 w-3.5 text-primary" />
                  </button>
                </div>
                <div className="p-3 flex flex-col flex-1 gap-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{product.category}</p>
                    <h3 className="text-sm font-semibold text-foreground leading-tight">{product.name}</h3>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">{product.price.toLocaleString()}đ</span>
                    <button onClick={() => !outOfStock && addToCart(product.id)} disabled={outOfStock} className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${inCart(product.id) ? "bg-success/20 text-success" : outOfStock ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"}`}>
                      {inCart(product.id) ? "✓ Added" : outOfStock ? "Sold Out" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setAddOpen(false)}>
          <div className="bg-background rounded-xl w-full max-w-lg border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-border text-base font-semibold">Add Product</div>
            <div className="p-5 space-y-3">
              <input className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              <input className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                <input className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
              </div>
              <input className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Distributor" value={newProduct.distributor} onChange={(e) => setNewProduct({ ...newProduct, distributor: e.target.value })} />
              <input className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" placeholder="Image URL" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
              <textarea className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm" rows={3} placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
            </div>
            <div className="p-5 border-t border-border flex gap-2 justify-end">
              <button onClick={() => setAddOpen(false)} className="rounded-lg border border-border bg-muted px-4 py-2 text-sm">Cancel</button>
              <button disabled={saving} onClick={saveProduct} className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm">{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {!loading && filtered.length === 0 && <div className="py-16 text-center text-muted-foreground">No products match your filters.</div>}

      {quickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setQuickView(null)}>
          <div className="card-glass rounded-2xl max-w-md w-full overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video bg-muted">
              <img src={quickView.image} alt={quickView.name} className="h-full w-full object-cover" />
              <button onClick={() => setQuickView(null)} className="absolute top-3 right-3 rounded-full bg-card/80 p-1.5 hover:bg-destructive/20 transition-colors">
                <X className="h-4 w-4 text-foreground" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">{quickView.category}</p>
                  <h2 className="text-lg font-bold text-foreground">{quickView.name}</h2>
                </div>
                <span className="text-xl font-bold text-primary">{quickView.price.toLocaleString()}đ</span>
              </div>
              <p className="text-sm text-muted-foreground">{quickView.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-muted p-2.5">
                  <p className="text-muted-foreground">Stock</p>
                  <p className="font-semibold text-foreground">{quickView.inventory?.stock ?? 0} units</p>
                </div>
                <div className="rounded-lg bg-muted p-2.5">
                  <p className="text-muted-foreground">Status</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig[getStatus(quickView)].className}`}>{statusConfig[getStatus(quickView)].label}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => { addToCart(quickView.id); setQuickView(null); }} disabled={getStatus(quickView) === "out-of-stock"} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors glow-primary">
                  {getStatus(quickView) === "out-of-stock" ? "Out of Stock" : "Add to Cart"}
                </button>
                <button className="rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Request Info</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
