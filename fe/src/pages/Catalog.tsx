import { products } from "@/data/mockData";
import { useState } from "react";
import { Search, X, ShoppingCart, Info, Star } from "lucide-react";

type Status = "in-stock" | "low-stock" | "out-of-stock";

const statusConfig: Record<Status, { label: string; className: string }> = {
  "in-stock": { label: "In Stock", className: "status-in-stock" },
  "low-stock": { label: "Low Stock", className: "status-low-stock" },
  "out-of-stock": { label: "Out of Stock", className: "status-out-of-stock" },
};

const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under 35,000đ", min: 0, max: 35000 },
  { label: "35,000 – 50,000đ", min: 35000, max: 50000 },
  { label: "50,000đ+", min: 50000, max: Infinity },
];

type Product = typeof products[0];

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [cart, setCart] = useState<number[]>([]);

  const range = priceRanges[priceRange];
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    const matchPrice = p.price >= range.min && p.price <= range.max;
    const matchAvail = !availableOnly || p.status !== "out-of-stock";
    return matchSearch && matchCat && matchPrice && matchAvail;
  });

  const addToCart = (id: number) => setCart((prev) => [...prev, id]);
  const inCart = (id: number) => cart.includes(id);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product Catalog</h1>
          <p className="text-sm text-muted-foreground">Browse all available products</p>
        </div>
        {cart.length > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-primary/15 border border-primary/30 px-4 py-2">
            <ShoppingCart className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{cart.length} in cart</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="card-glass rounded-xl p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-border bg-muted pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="accent-primary"
            />
            Available only
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                  category === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 ml-auto">
            {priceRanges.map((r, i) => (
              <button
                key={i}
                onClick={() => setPriceRange(i)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                  priceRange === i
                    ? "bg-accent text-accent-foreground border-accent"
                    : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground bg-muted"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((product) => {
          const { label, className } = statusConfig[product.status];
          const outOfStock = product.status === "out-of-stock";
          return (
            <div
              key={product.id}
              className="card-glass rounded-xl overflow-hidden group hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-square bg-muted overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
                  {label}
                </span>
                <button
                  onClick={() => setQuickView(product)}
                  className="absolute bottom-2 right-2 rounded-full bg-card/80 backdrop-blur-sm p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/20"
                >
                  <Info className="h-3.5 w-3.5 text-primary" />
                </button>
              </div>
              {/* Info */}
              <div className="p-3 flex flex-col flex-1 gap-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{product.category}</p>
                  <h3 className="text-sm font-semibold text-foreground leading-tight">{product.name}</h3>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">{product.price.toLocaleString()}đ</span>
                  <button
                    onClick={() => !outOfStock && addToCart(product.id)}
                    disabled={outOfStock}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      inCart(product.id)
                        ? "bg-success/20 text-success"
                        : outOfStock
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    {inCart(product.id) ? "✓ Added" : outOfStock ? "Sold Out" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          No products match your filters.
        </div>
      )}

      {/* Quick View Modal */}
      {quickView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setQuickView(null)}
        >
          <div
            className="card-glass rounded-2xl max-w-md w-full overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-muted">
              <img
                src={quickView.image}
                alt={quickView.name}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setQuickView(null)}
                className="absolute top-3 right-3 rounded-full bg-card/80 p-1.5 hover:bg-destructive/20 transition-colors"
              >
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
                  <p className="font-semibold text-foreground">{quickView.stock} units</p>
                </div>
                <div className="rounded-lg bg-muted p-2.5">
                  <p className="text-muted-foreground">Distributor</p>
                  <p className="font-semibold text-foreground">{quickView.distributor}</p>
                </div>
                <div className="rounded-lg bg-muted p-2.5">
                  <p className="text-muted-foreground">Batch #</p>
                  <p className="font-semibold text-foreground font-mono">{quickView.batchNumber}</p>
                </div>
                <div className="rounded-lg bg-muted p-2.5">
                  <p className="text-muted-foreground">Status</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig[quickView.status].className}`}>
                    {statusConfig[quickView.status].label}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { addToCart(quickView.id); setQuickView(null); }}
                  disabled={quickView.status === "out-of-stock"}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors glow-primary"
                >
                  {quickView.status === "out-of-stock" ? "Out of Stock" : "Add to Cart"}
                </button>
                <button className="rounded-xl border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Request Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
