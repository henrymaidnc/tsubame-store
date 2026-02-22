
import { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  ShoppingBag,
  Star,
  Heart,
  Filter,
  Grid,
  List,
  ArrowRight,
  Menu,
  ChevronDown,
  ShoppingCart,
  Shield,
  Truck,
  Gift,
  Sparkles,
  Package,
  Mail,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  ExternalLink,
  ChevronUp,
  Eye,
  Palette,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { productsAPI } from "@/lib/api";

/* ─── Types ─────────────────────────────────────────────── */
type Status = "in-stock" | "low-stock" | "out-of-stock";
interface Inventory {
  id: number;
  product_id: number;
  stock: number;
  status: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  description: string;
  shopee_link?: string | null;
  inventory?: Inventory | null;
}

const getProductStatus = (product: Product): Status => {
  const stock = product.inventory?.stock || 0;
  if (stock > 20) return "in-stock";
  if (stock > 0) return "low-stock";
  return "out-of-stock";
};
type LandingTheme = "default" | "green" | "dark";

const themeOptions: { id: LandingTheme; label: string; swatch: string }[] = [
  { id: "default", label: "Default", swatch: "bg-orange-500" },
  { id: "green", label: "Green", swatch: "bg-emerald-500" },
  { id: "dark", label: "Dark", swatch: "bg-gray-800 border border-gray-600" },
];

const statusConfig: Record<
  Status,
  { label: string; dot: string; badge: string }
> = {
  "in-stock": {
    label: "In Stock",
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  },
  "low-stock": {
    label: "Low Stock",
    dot: "bg-amber-500",
    badge:
      "bg-amber-50 text-amber-700 border border-amber-200/60",
  },
  "out-of-stock": {
    label: "Sold Out",
    dot: "bg-rose-500",
    badge:
      "bg-rose-50 text-rose-700 border border-rose-200/60",
  },
};


const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under 35,000đ", min: 0, max: 35000 },
  { label: "35k – 50kđ", min: 35000, max: 50000 },
  { label: "50,000đ+", min: 50000, max: Infinity },
];

/* ─── Helpers ───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      className="text-center mb-14"
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 text-primary text-xs font-bold tracking-wide uppercase mb-4 border border-primary/20">
          <Sparkles className="w-3 h-3" />
          {eyebrow}
        </span>
      )}
      <h3 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
        {title}
      </h3>
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

function TrustBadgeItem({
  icon: Icon,
  title,
  desc,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      custom={index}
      className="flex items-start gap-3"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </motion.div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  accent,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  accent: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      custom={index}
      className="group"
    >
      <div className="relative bg-card rounded-2xl p-7 border border-border/60 hover:border-border transition-all duration-300 hover:shadow-lg h-full">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${accent} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h4 className="text-lg font-bold text-foreground mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ────────────────────────────────────── */
export default function Landing() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [theme, setTheme] = useState<LandingTheme>("default");
  const [showThemePicker, setShowThemePicker] = useState(false);

  useEffect(() => {
    const title = "Tsubame Arts";
    const description =
      "🔋✨ Let me recharge you with cute little things ✨🔋";
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (metaDesc) metaDesc.setAttribute("content", description);
    const setMeta = (selector: string, attr: "content" | "href", value: string) => {
      const el = document.querySelector(selector) as HTMLElement | null;
      if (el) el.setAttribute(attr, value);
    };
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
  }, []);



  useEffect(() => {
    productsAPI
      .getAll()
      .then((list) => {
        setProducts(list);
        const cats = Array.from(new Set(list.map((p: Product) => p.category))) as string[];
        setCategories(["All", ...cats]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
        setCategories(["All"]);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Apply theme attribute to wrapper
  useEffect(() => {
    return () => {
      // Clean up on unmount so admin pages aren't affected
      document.documentElement.removeAttribute("data-landing-theme");
    };
  }, []);

  const range = priceRanges[priceRange];
  const filtered = products.filter((p) => {
    const matchSearch =
      (p.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    // Price logic
    const matchPrice = p.price >= range.min && p.price <= range.max;
    const matchAvail = !availableOnly || getProductStatus(p) !== "out-of-stock";
    return matchSearch && matchCat && matchPrice && matchAvail;
  });

  const activeFilterCount =
    (category !== "All" ? 1 : 0) +
    (priceRange !== 0 ? 1 : 0) +
    (availableOnly ? 1 : 0);

  const toggleFavorite = (id: number) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  const isFavorite = (id: number) => favorites.includes(id);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg"
        >
          <Sparkles className="w-7 h-7 text-primary-foreground" />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="landing-font min-h-screen bg-background text-foreground transition-colors duration-300"
      data-landing-theme={theme === "default" ? undefined : theme}
    >
      {/* ════════════════════════════════════════════════════ */}
      {/* HEADER                                               */}
      {/* ════════════════════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-background/90 backdrop-blur-xl shadow-sm border-b border-border/50"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="relative w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <ShoppingBag className="w-[18px] h-[18px] text-primary-foreground" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-foreground">
                TsubameArt<span className="text-primary">Store</span>
              </span>
            </motion.div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {["Products", "About", "Contact"].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                >
                  {item}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="ml-3"
              >
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2 rounded-full text-sm font-semibold hover:bg-foreground/90 transition-colors"
                >
                  Admin Portal
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </motion.div>

              {/* Theme Switcher */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="relative"
              >
                <button
                  onClick={() => setShowThemePicker(!showThemePicker)}
                  className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                  title="Switch theme"
                >
                  <Palette className="w-4.5 h-4.5" />
                </button>
                <AnimatePresence>
                  {showThemePicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 bg-background border border-border rounded-xl shadow-lg p-2 min-w-[140px] z-50"
                    >
                      {themeOptions.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id);
                            setShowThemePicker(false);
                          }}
                          className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${theme === t.id
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            }`}
                        >
                          <span className={`w-4 h-4 rounded-full ${t.swatch} flex-shrink-0`} />
                          {t.label}
                          {theme === t.id && (
                            <span className="ml-auto text-primary text-xs">✓</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </nav>

            {/* Mobile Toggle */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              whileTap={{ scale: 0.92 }}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border"
            >
              <div className="px-4 py-5 space-y-1">
                {["Products", "About", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-3">
                  <Link
                    to="/login"
                    className="block text-center bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-semibold"
                  >
                    Admin Portal
                  </Link>
                </div>

                {/* Theme switcher in mobile */}
                <div className="pt-2 border-t border-border">
                  <p className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Theme
                  </p>
                  <div className="flex gap-2 px-3 py-2">
                    {themeOptions.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${theme === t.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-foreground/20"
                          }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${t.swatch} flex-shrink-0`} />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ════════════════════════════════════════════════════ */}
      {/* HERO                                                 */}
      {/* ════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden h-[160px] sm:h-[320px] md:h-[360px] lg:h-[400px] xl:h-[600px]">
        {/* Floating fox decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#c7ecf1_0%,white_85%)]" />
          <img
            src="/background.jpg"
            alt="Tsubame Arts hero background"
            className="absolute inset-0 h-full w-full object-contain md:object-cover"
            style={{ objectPosition: 'center top' }}
          />
          <motion.img
            src="/tsubame.png"
            alt="Mascot"
            animate={{ y: [0, -18, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 left-[8%] w-12 h-12 md:w-16 md:h-16 opacity-50"
          />
          <motion.span
            animate={{ y: [0, 14, 0], rotate: [5, -5, 5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute top-28 right-[10%] text-3xl md:text-4xl opacity-40"
          >✨</motion.span>
          <motion.span
            animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            className="absolute bottom-16 left-[15%] text-2xl md:text-3xl opacity-35"
          >🌸</motion.span>
          <motion.span
            animate={{ y: [0, 16, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute top-1/3 right-[5%] text-2xl md:text-3xl opacity-30"
          >⭐</motion.span>
          <motion.img
            src="/tsubame.png"
            alt="Mascot"
            animate={{ y: [0, -18, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 left-[8%] w-12 h-12 md:w-16 md:h-16 opacity-50"
          />
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 flex items-center justify-center">
          <div className="max-w-3xl mx-auto text-center">
            {/* <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
            >
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide mb-6 border border-primary/20">
                🎨 Handcrafted with love in Vietnam 🌸
              </span>
            </motion.div> */}

            {/* <motion.h2
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6"
            >
              Meet Your New
              <br />
              <span className="gradient-text italic">Foxy Friends</span>
              {" "}🦊✨
            </motion.h2>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto"
            >
              Super cute stickers, charms & figurines — all handmade by one very dedicated fox lover 🐾
              <br />
              <span className="font-bold text-foreground">Kawaii guaranteed!</span>
            </motion.p> */}

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.a
                href="#products"
                whileHover={{ scale: 1.06, rotate: -1 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="cartoon-btn group inline-flex items-center gap-2.5 bg-primary text-primary-foreground px-7 py-3.5 rounded-2xl font-bold text-base"
              >
                🛍️ Shop Now!
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              {/* <motion.a
                href="#about"
                whileHover={{ scale: 1.06, rotate: 1 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="cartoon-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base bg-background"
              >
                🌸 Learn More
              </motion.a> */}
            </motion.div>

            {/* Stats row */}
            {/* <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={4}
              className="flex items-center justify-center gap-8 md:gap-12 mt-14 pt-8 border-t border-border/50"
            >
              {[
                { value: "10+", label: "Unique Products" },
                { value: "15+", label: "Retail Partners" },
                { value: "2K+", label: "Happy Customers" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-extrabold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div> */}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="max-w-2xl rounded-2xl bg-muted/30 border border-border/40 px-6 py-5">
            <p className="text-center text-sm md:text-base text-muted-foreground">
              🔋✨ Let me recharge you with cute little things ✨🔋
              <br />
              Xin chào các cậu đến với chiếc shop nhỏ Tsubame.arts - nơi bán các sản phẩm cute do tớ tự thiết kế 😊🐥
            </p>
          </div>
        </div>
      </section>
      <div className="flex items-center justify-center py-2">
        <a href="#about" className="inline-flex items-center justify-center w-12 h-12 text-foreground hover:bg-muted/80 transition-colors">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </a>
      </div>

      {/* ════════════════════════════════════════════════════ */}
      {/* TRUST BADGES                                         */}
      {/* ════════════════════════════════════════════════════ */}
      {/* <section className="border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: Truck,
                title: "Fast Shipping",
                desc: "2–5 day delivery nationwide",
              },
              {
                icon: Shield,
                title: "Quality Guaranteed",
                desc: "Hand-inspected before shipping",
              },
              {
                icon: Gift,
                title: "Gift Ready",
                desc: "Beautiful packaging included",
              },
              {
                icon: Package,
                title: "Eco Packaging",
                desc: "Sustainable materials used",
              },
            ].map((item, i) => (
              <TrustBadgeItem
                key={item.title}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
                index={i}
              />
            ))}
          </div>
        </div>
      </section> */}

      {/* ════════════════════════════════════════════════════ */}
      {/* WHY CHOOSE US                                        */}
      {/* ════════════════════════════════════════════════════ */}
      <section id="about" className="py-8 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Why TsubameArts"
            title="Crafted With Passion"
            subtitle="Every product is designed and made by hand with attention to the smallest details."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Star,
                title: "Premium Materials",
                description:
                  "We source the finest materials — waterproof lamination, high-grade resin, and archival-quality inks.",
                accent: "from-amber-400 to-orange-500",
              },
              {
                icon: Heart,
                title: "Original Artwork",
                description:
                  "Every design is an original illustration. You won't find these whimsical foxes anywhere else.",
                accent: "from-rose-400 to-pink-500",
              },
              {
                icon: ShoppingBag,
                title: "Thoughtful Delivery",
                description:
                  "Each order ships gift-ready with eco-friendly packaging and a handwritten thank you note.",
                accent: "from-sky-400 to-blue-500",
              },
            ].map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                accent={feature.accent}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════ */}
      {/* PRODUCTS                                             */}
      {/* ════════════════════════════════════════════════════ */}
      <section
        id="products"
        className="py-8 md:py-20 px-4 sm:px-6 lg:px-8 bg-muted/20"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Shop"
            title="Our Collection"
            subtitle="Browse our curated selection of fox-themed treasures"
          />

          {/* Search & Toolbar */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Toolbar Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${showFilters || activeFilterCount > 0
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                    }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${showFilters ? "rotate-180" : ""
                      }`}
                  />
                </button>

                <div className="flex bg-background border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 transition-colors ${viewMode === "grid"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                    title="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 transition-colors ${viewMode === "list"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="bg-background p-5 rounded-2xl border border-border shadow-sm space-y-5">
                    {/* Categories */}
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                        Category
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${category === cat
                              ? "bg-foreground text-background shadow-sm"
                              : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                              }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                        Price Range
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {priceRanges.map((r, i) => (
                          <button
                            key={i}
                            onClick={() => setPriceRange(i)}
                            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${priceRange === i
                              ? "bg-foreground text-background shadow-sm"
                              : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                              }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Availability toggle */}
                    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none group">
                      <div
                        className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${availableOnly ? "bg-primary" : "bg-border"
                          }`}
                        onClick={() => setAvailableOnly(!availableOnly)}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${availableOnly ? "translate-x-4" : ""
                            }`}
                        />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        Available only
                      </span>
                    </label>

                    {/* Clear filters */}
                    {activeFilterCount > 0 && (
                      <button
                        onClick={() => {
                          setCategory("All");
                          setPriceRange(0);
                          setAvailableOnly(false);
                        }}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results count */}
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>{" "}
              of {products.length} products
            </p>
          </div>

          {/* ── Product Grid ── */}
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Search className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg font-medium">
                No products found
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </motion.div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
                  : "space-y-3"
              }
            >
              <AnimatePresence>
                {filtered.map((product, index) => {
                  const pStatus = getProductStatus(product);
                  const { label, dot, badge } = statusConfig[pStatus];
                  const outOfStock = pStatus === "out-of-stock";

                  if (viewMode === "grid") {
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ delay: index * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="group"
                      >
                        <div className="cartoon-card bg-background rounded-2xl overflow-hidden">
                          {/* Image */}
                          <div className="relative aspect-square overflow-hidden bg-muted/40">
                            {product.shopee_link ? (
                              <a href={product.shopee_link} target="_blank" rel="noreferrer" title="Shop on Shopee">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              </a>
                            ) : (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            )}

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Status badge */}
                            <span
                              className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${badge}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${dot}`}
                              />
                              {label}
                            </span>

                            {/* Action buttons */}
                            <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                              <button
                                onClick={() => toggleFavorite(product.id)}
                                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-sm"
                              >
                                <Heart
                                  className={`w-3.5 h-3.5 transition-colors ${isFavorite(product.id)
                                    ? "fill-rose-500 text-rose-500"
                                    : "text-gray-600"
                                    }`}
                                />
                              </button>
                              <button
                                onClick={() => setQuickView(product)}
                                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-sm"
                              >
                                <Eye className="w-3.5 h-3.5 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-4">
                            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-1">
                              {product.category}
                            </p>
                            <h3 className="text-sm font-semibold text-foreground mb-3 line-clamp-2 leading-snug min-h-[2.5rem]">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between gap-2">
                              {/* <span className="text-base font-bold text-foreground">
                                {product.price.toLocaleString()}
                                <span className="text-xs font-medium text-muted-foreground ml-0.5">
                                  đ
                                </span>
                              </span> */}
                              <button
                                disabled={outOfStock}
                                className={`p-2 rounded-xl transition-all duration-200 ${outOfStock
                                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                                  : "bg-foreground text-background hover:bg-foreground/90 active:scale-95"
                                  }`}
                                title={outOfStock ? "Sold Out" : "Add to Cart"}
                              >
                                <ShoppingCart className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  /* ── List View ── */
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="cartoon-card group bg-background rounded-2xl p-4"
                    >
                      <div className="flex gap-4 sm:gap-5">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-muted/40">
                          {product.shopee_link ? (
                            <a href={product.shopee_link} target="_blank" rel="noreferrer" title="Shop on Shopee">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </a>
                          ) : (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
                                {product.category}
                              </p>
                              <h3 className="text-base font-semibold text-foreground mb-1 truncate">
                                {product.name}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-1 hidden sm:block">
                                {product.description}
                              </p>
                            </div>
                            <button
                              onClick={() => toggleFavorite(product.id)}
                              className="p-1.5 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                            >
                              <Heart
                                className={`w-4 h-4 transition-colors ${isFavorite(product.id)
                                  ? "fill-rose-500 text-rose-500"
                                  : "text-muted-foreground"
                                  }`}
                              />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-3 gap-3">
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg font-bold text-foreground">
                                <span className="text-primary mr-1">đ</span>
                                {product.price.toLocaleString()}đ
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${dot}`}
                                />
                                {label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setQuickView(product)}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium hidden sm:block"
                              >
                                Quick View
                              </button>
                              <button
                                disabled={outOfStock}
                                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${outOfStock
                                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                                  : "bg-foreground text-background hover:bg-foreground/90 active:scale-95"
                                  }`}
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                {outOfStock ? "Sold Out" : "Add"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════ */}
      {/* NEWSLETTER / CTA                                     */}
      {/* ════════════════════════════════════════════════════ */}
      <section id="contact" className="py-8 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-foreground rounded-3xl overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative px-8 py-14 md:px-16 md:py-20 text-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
              >
                <Mail className="w-10 h-10 text-primary mx-auto mb-5" />
                <h3 className="text-2xl md:text-3xl font-extrabold text-background mb-3 tracking-tight">
                  Stay in the Loop
                </h3>
                <p className="text-background/60 max-w-md mx-auto mb-8 text-sm md:text-base">
                  Get notified about new launches, seasonal drops, and exclusive discounts.
                </p>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-background/10 border border-background/20 text-background placeholder:text-background/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════ */}
      {/* QUICK VIEW MODAL                                     */}
      {/* ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {quickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setQuickView(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-muted/40">
                <img
                  src={quickView.image}
                  alt={quickView.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setQuickView(null)}
                  className="absolute top-3 right-3 w-9 h-9 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors shadow-sm"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
                {/* Status */}
                <span
                  className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusConfig[getProductStatus(quickView)].badge
                    }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${statusConfig[getProductStatus(quickView)].dot
                      }`}
                  />
                  {statusConfig[getProductStatus(quickView)].label}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-1">
                    {quickView.category}
                  </p>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {quickView.name}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {quickView.description}
                  </p>
                </div>

                <div className="text-2xl font-bold text-foreground">
                  <span className="text-primary mr-1">đ</span>
                  {quickView.price.toLocaleString()}
                  <span className="text-base font-medium text-muted-foreground ml-1">
                    đ
                  </span>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-xl p-3.5">
                    <p className="text-xs text-muted-foreground mt-0.5">
                      In Stock
                    </p>
                    <p className="text-xs font-semibold text-foreground">
                      {quickView.inventory?.stock || 0} units
                    </p>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {quickView.shopee_link && (
                    <a
                      href={quickView.shopee_link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 cartoon-btn bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all"
                      onClick={(e) => e.stopPropagation()}
                      title="Buy on Shopee"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Buy on Shopee
                    </a>
                  )}
                  <button
                    onClick={(e) => e.stopPropagation()}
                    disabled={getProductStatus(quickView) === "out-of-stock"}
                    className="flex-1 cartoon-btn bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {getProductStatus(quickView) === "out-of-stock"
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => toggleFavorite(quickView.id)}
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${isFavorite(quickView.id)
                      ? "bg-rose-50 border-rose-200 text-rose-500"
                      : "bg-muted/50 border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                      }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite(quickView.id) ? "fill-rose-500" : ""
                        }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════ */}
      {/* FOOTER                                               */}
      {/* ════════════════════════════════════════════════════ */}
      <footer className="bg-[#0f1117] text-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-base font-bold text-white">
                  TsubameStore
                </span>
              </div>
              <p className="text-sm leading-relaxed text-white/40 mb-4">
                Where magic meets craftsmanship in every fox-themed creation.
              </p>
              <div className="flex gap-3">
                {[
                  { Icon: Instagram, href: "https://www.instagram.com/tsubame.arts/?hl=en" },
                  { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61562372116408" },
                ].map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {["Products", "About", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-4">
                Categories
              </h4>
              <ul className="space-y-2.5">
                {["Sticker", "Charm", "Packaging", "Clay", "Print"].map(
                  (item) => (
                    <li key={item}>
                      <button
                        onClick={() => {
                          setCategory(item);
                          document
                            .getElementById("products")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="text-sm text-white/50 hover:text-white transition-colors"
                      >
                        {item}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-4">
                Get in Touch
              </h4>
              <ul className="space-y-2.5">
                {[
                  { icon: Mail, text: "info@tsubame-arts.com" },
                  { icon: Phone, text: "+84 123 456 789" },
                  { icon: MapPin, text: "Ho Chi Minh, Vietnam" },
                ].map((item) => (
                  <li
                    key={item.text}
                    className="flex items-center gap-2 text-sm text-white/50"
                  >
                    <item.icon className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} Tsubame Store. All rights reserved.
            </p>
            <p className="text-xs text-white/30">
              Made with ❤️ and fox magic in Vietnam
            </p>
          </div>
        </div>
      </footer>

      {/* ═══ Back to Top ═══ */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-40 w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
