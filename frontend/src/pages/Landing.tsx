
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
type LandingTheme = "default" | "green" | "pink" | "dark";

const themeOptions: { id: LandingTheme; label: string; swatch: string }[] = [
  { id: "default", label: "Default", swatch: "bg-orange-500" },
  { id: "green", label: "Green", swatch: "bg-emerald-500" },
  { id: "pink", label: "Pink", swatch: "bg-pink-400" },
  { id: "dark", label: "Dark", swatch: "bg-gray-800 border border-gray-600" },
];

const statusConfig: Record<
  Status,
  { label: string; dot: string; badge: string }
> = {
  "in-stock": {
    label: "Còn hàng",
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  },
  "low-stock": {
    label: "Sắp hết hàng",
    dot: "bg-amber-500",
    badge:
      "bg-amber-50 text-amber-700 border border-amber-200/60",
  },
  "out-of-stock": {
    label: "Tạm hết hàng",
    dot: "bg-rose-500",
    badge:
      "bg-rose-50 text-rose-700 border border-rose-200/60",
  },
};


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
      className="text-center mb-20"
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/15 text-primary text-xs font-bold tracking-widest uppercase mb-6 border border-primary/20 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5" />
          {eyebrow}
        </span>
      )}
      <h3 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
        {title}
      </h3>
      {subtitle && (
        <p className="text-muted-foreground/80 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
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
      <div className="chill-card bg-card p-8 h-full">
        <div
          className={`w-14 h-14 bg-gradient-to-br ${accent} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h4 className="text-xl font-bold text-foreground mb-3">{title}</h4>
        <p className="text-base text-muted-foreground/80 leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ────────────────────────────────────── */
export default function Landing() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["Tất cả"]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [theme, setTheme] = useState<LandingTheme>("default");
  const [showThemePicker, setShowThemePicker] = useState(false);

  useEffect(() => {
    const title = "TSUBAME'S STICKER SHOP ✨";
    const description =
      "🔋✨ Để tớ nạp năng lượng cho cậu bằng những thứ nhỏ bé đáng yêu này nhé ✨🔋";
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
        setCategories(["Tất cả", ...cats]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
        setCategories(["Tất cả"]);
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

  const filtered = products.filter((p) => {
    const matchSearch =
      (p.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Tất cả" || p.category === category;
    // Price logic
    const matchAvail = !availableOnly || getProductStatus(p) !== "out-of-stock";
    return matchSearch && matchCat && matchAvail;
  });

  const activeFilterCount =
    (category !== "Tất cả" ? 1 : 0) +
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
                TSUBAME'S STICKER<span className="text-primary"> SHOP ✨</span>
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
                  {item === "Products" ? "Sản phẩm" : item === "About" ? "Giới thiệu" : "Liên hệ"}
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
                  Quản trị viên
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
                  title="Đổi giao diện"
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
                    Trang quản trị
                  </Link>
                </div>

                {/* Theme switcher in mobile */}
                <div className="pt-2 border-t border-border">
                  <p className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Giao diện
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
      <section className="relative overflow-hidden h-auto">
        <div className="relative pointer-events-none overflow-hidden select-none w-full">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#c7ecf1_0%,white_85%)]" />
          <img
            src="/background.jpg"
            alt="Tsubame Arts hero background"
            className="w-full h-auto block relative z-0"
          />
          <motion.img
            src="/tsubame.png"
            alt="Mascot"
            animate={{ y: [0, -25, 0], rotate: [-8, 8, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] w-16 h-16 md:w-24 md:h-24 opacity-60 drop-shadow-2xl"
          />
          <motion.span
            animate={{ y: [0, 20, 0], rotate: [10, -10, 10] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute top-32 right-[12%] text-4xl md:text-5xl opacity-50 filter blur-[1px]"
          >✨</motion.span>
          <motion.span
            animate={{ y: [0, -15, 0], x: [0, 12, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            className="absolute bottom-20 left-[18%] text-3xl md:text-4xl opacity-45 filter blur-[0.5px]"
          >🌸</motion.span>
          <motion.span
            animate={{ y: [0, 25, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute top-1/2 right-[8%] text-3xl md:text-4xl opacity-40 filter blur-[1px]"
          >⭐</motion.span>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-background/20" />
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute -bottom-48 -left-32 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center relative z-10">




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
                className="chill-btn group inline-flex items-center gap-2.5 bg-primary text-primary-foreground px-7 py-4.5 rounded-2xl font-bold text-base"
              >
                Mua Ngay!
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              {/* <motion.a
                href="#about"
                whileHover={{ scale: 1.06, rotate: 1 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="chill-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base bg-background"
              >
                🌸 Xem thêm
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
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
.div> */}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="max-w-2xl rounded-2xl bg-muted/30 border border-border/40 px-6 py-5">
            <p className="text-center text-sm md:text-base text-muted-foreground">
              🔋✨ Để tớ nạp năng lượng cho cậu bằng những thứ nhỏ bé đáng yêu này nhé ✨🔋
              <br />
              Xin chào các cậu đến với chiếc shop nhỏ Tsubame.arts - nơi bán các sản phẩm cute do tớ tự thiết kế 😊🐥
            </p>
          </div>
        </div>
      </section>
      <div className="flex items-center justify-center">
        <a href="#about" className="inline-flex items-center justify-center w-12 text-foreground hover:bg-muted/80 transition-colors">
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
                desc: "Chúng tớ tôn trọng sự riêng tư của cậu. Không spam, hứa luôn! 🌸",
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
      </section>

      {/* ════════════════════════════════════════════════════ */}
      {/* WHY CHOOSE US                                        */}
      {/* ════════════════════════════════════════════════════ */}
      <section id="about" className="py-8 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Tại sao chọn TsubameArts"
            title="Nạp năng lượng nhé?"
            subtitle="Đăng ký nhận tin để là người đầu tiên biết về các bộ sưu tập mới và ưu đãi đặc quyền."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Star,
                title: "Chất liệu cao cấp",
                description:
                  "Tớ luôn tìm chọn những chất liệu tốt nhất — cán màng chống thấm nước, resin cao cấp và mực in chất lượng họa sĩ.",
                accent: "from-amber-400 to-orange-500",
              },
              {
                icon: Heart,
                title: "Tác phẩm gốc",
                description:
                  "Mỗi thiết kế đều là hình minh họa gốc. Cậu sẽ không tìm thấy những chú cáo kỳ quặc này ở bất cứ nơi nào khác đâu.",
                accent: "from-rose-400 to-pink-500",
              },
              {
                icon: ShoppingBag,
                title: "Giao hàng chu đáo",
                description:
                  "Mỗi đơn hàng đều được đóng gói như một món quà xinh xắn với bao bì thân thiện môi trường và một tấm thiệp cảm ơn viết tay.",
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
      {/* PRODUCTS SECTION                                    */}
      {/* ════════════════════════════════════════════════════ */}
      <section id="products" className="py-8 md:py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Cửa hàng"
            title="Bộ sưu tập của chúng tớ"
            subtitle="Khám phá những kho báu chủ đề cáo được tuyển chọn kỹ lưỡng"
          />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Danh Mục */}
            <aside className="hidden lg:block w-48 flex-shrink-0">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-border/60">
                <List className="w-5 h-5" />
                <h3 className="font-bold text-lg text-foreground">Danh Mục</h3>
              </div>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => setCategory("Tất cả")}
                    className={`flex items-center gap-2 w-full text-left text-sm font-medium transition-all ${category === "Tất cả" ? "sidebar-item-active" : "sidebar-item-inactive"
                      }`}
                  >
                    <span className={category === "Tất cả" ? "text-primary" : "text-transparent"}>▶</span>
                    Sản Phẩm
                  </button>
                  <ul className="mt-3 ml-4 space-y-3 border-l border-border pl-4">
                    {categories.filter(c => c !== "Tất cả").map((cat) => (
                      <li key={cat}>
                        <button
                          onClick={() => setCategory(cat)}
                          className={`block text-[13px] font-medium transition-all ${category === cat ? "sidebar-item-active" : "sidebar-item-inactive"
                            }`}
                        >
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Shopee-style Sorting Header */}
              <div className="bg-muted px-4 py-3 rounded-lg flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-foreground/80">Sắp xếp theo</span>
                  <div className="flex flex-wrap gap-2">
                    <button className="shopee-tab shopee-tab-active">Phổ Biến</button>
                    <button className="shopee-tab shopee-tab-inactive">Mới Nhất</button>
                    <button className="shopee-tab shopee-tab-inactive">Bán Chạy</button>
                    <div className="relative group">
                      <button className="shopee-tab shopee-tab-inactive flex items-center gap-2 min-w-[120px] justify-between">
                        Giá
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-primary font-bold">1</span>
                    <span className="text-foreground/60">/4</span>
                  </div>
                  <div className="flex bg-white rounded-lg border border-border/40 overflow-hidden shadow-sm">
                    <button className="p-2 text-foreground/40 hover:text-foreground transition-colors border-r border-border/40">
                      <ChevronUp className="w-4 h-4 -rotate-90" />
                    </button>
                    <button className="p-2 text-foreground/60 hover:text-primary transition-colors">
                      <ChevronUp className="w-4 h-4 rotate-90" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Category Select */}
              <div className="lg:hidden mb-6">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c === "Tất cả" ? "Sản Phẩm (Tất cả)" : c}</option>
                  ))}
                </select>
              </div>

              {/* Search Result Summary and Available Filter */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Tìm thấy <span className="font-bold text-foreground">{filtered.length}</span> sản phẩm
                  </p>
                  <div className="h-4 w-px bg-border hidden sm:block" />
                  <label className="inline-flex items-center gap-2.5 cursor-pointer select-none group">
                    <div
                      className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${availableOnly ? "bg-primary" : "bg-border"}`}
                      onClick={() => setAvailableOnly(!availableOnly)}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${availableOnly ? "translate-x-4" : ""}`}
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      Sản phẩm hiện có
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Grid / List */}
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <Search className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-4">Không tìm thấy sản phẩm nào</h2>
                  <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                    Thử điều chỉnh bộ lọc hoặc tìm kiếm khác để tìm thứ cậu muốn nhé.
                  </p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setCategory("Tất cả");
                      setAvailableOnly(false);
                    }}
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/95 transition-all"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </motion.div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
                      : "space-y-4"
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
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="group"
                          >
                            <div className="chill-card bg-background overflow-hidden h-full flex flex-col">
                              <div className="relative aspect-[4/5] overflow-hidden bg-muted/40">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <span className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-bold ${badge}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                                  {label}
                                </span>

                                <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                                  <button
                                    onClick={() => toggleFavorite(product.id)}
                                    className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-sm"
                                  >
                                    <Heart className={`w-3.5 h-3.5 ${isFavorite(product.id) ? "fill-rose-500 text-rose-500" : "text-gray-600"}`} />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setQuickView(product); }}
                                    className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-sm"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-gray-600" />
                                  </button>
                                </div>
                              </div>
                              <div className="p-3 flex flex-col flex-1">
                                <h3 className="text-[13px] font-medium text-foreground line-clamp-2 leading-relaxed mb-auto h-[2.8rem]">
                                  {product.name}
                                </h3>
                                <div className="mt-3 flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="text-primary font-bold text-sm">
                                      <span className="text-[10px] mr-1">đ</span>
                                      {product.price.toLocaleString()}
                                    </span>
                                  </div>
                                  <button
                                    disabled={outOfStock}
                                    onClick={(e) => { e.stopPropagation(); }}
                                    className={`p-2 rounded-lg transition-all ${outOfStock ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                                  >
                                    <ShoppingCart className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      }

                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          className="chill-card bg-background p-4 flex gap-4"
                        >
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted/40">
                            <img src={product.image} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h3 className="text-sm font-semibold truncate">{product.name}</h3>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{product.description}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-primary font-bold">
                                đ{product.price.toLocaleString()}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setQuickView(product)}
                                  className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  disabled={outOfStock}
                                  className={`p-2 rounded-lg ${outOfStock ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                </button>
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
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════ */}
      {/* NEWSLETTER / CTA                                     */}
      {/* ════════════════════════════════════════════════════ */}
      <section id="contact" className="py-8 md:py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-foreground rounded-[2rem] overflow-hidden px-8 py-16 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 max-w-2xl mx-auto"
            >
              <Mail className="w-10 h-10 text-primary mx-auto mb-6" />
              <h3 className="text-3xl font-black text-background mb-4">Nạp năng lượng nhé?</h3>
              <p className="text-background/60 mb-10">Đăng ký nhận tin để là người đầu tiên biết về các bộ sưu tập mới và ưu đãi đặc quyền.</p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Địa chỉ email của cậu..."
                  className="flex-1 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button type="submit" className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all">
                  Đăng ký
                </button>
              </form>
              <p className="mt-6 text-xs text-background/40">Chúng tớ tôn trọng sự riêng tư của cậu. Không spam, hứa luôn! 🌸</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════ */}
      {/* QUICK VIEW MODAL                                     */}
      {/* ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {quickView && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              onClick={() => setQuickView(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-background rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-visible"
            >
              <button
                onClick={() => setQuickView(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-1/2 aspect-square">
                <img src={quickView.image} alt={quickView.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 p-8 md:p-10 flex flex-col">
                <div className="mb-auto">
                  <span className="text-xs font-bold text-primary tracking-widest uppercase mb-2 block">{quickView.category}</span>
                  <h2 className="text-2xl font-black text-foreground mb-4 leading-tight">{quickView.name}</h2>
                  <div className="py-4 border-y border-border/60 my-6">
                    <p className="text-sm font-bold text-muted-foreground uppercase mb-2">Mô tả sản phẩm</p>
                    <p className="text-muted-foreground leading-relaxed">{quickView.description || "Chưa có mô tả cho sản phẩm này."}</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 chill-btn bg-primary text-primary-foreground py-4 rounded-2xl font-bold shadow-lg shadow-primary/20">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Thêm vào giỏ
                  </button>
                  {quickView.shopee_link && (
                    <a
                      href={quickView.shopee_link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 chill-btn bg-muted text-foreground py-4 rounded-2xl font-bold hover:bg-muted/80 flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Mua trên Shopee
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════ */}
      {/* FOOTER                                               */}
      {/* ════════════════════════════════════════════════════ */}
      <footer className="bg-[#0f1117] text-white/40 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-black text-white tracking-tight">Tsubamearts</span>
              </div>
              <p className="text-sm leading-relaxed mb-8">Để tớ nạp năng lượng cho cậu bằng những thứ nhỏ bé đáng yêu này nhé 😊🐥</p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/tsubame.arts/?hl=en" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61562372116408" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Khám phá</h4>
              <ul className="space-y-4">
                {["Sản phẩm", "Giới thiệu", "Liên hệ"].map(link => (
                  <li key={link}>
                    <a href={`#${link}`} className="text-sm hover:text-primary transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Danh mục</h4>
              <ul className="space-y-4">
                {categories.slice(1, 4).map(cat => (
                  <li key={cat}>
                    <button onClick={() => setCategory(cat)} className="text-sm hover:text-primary transition-colors">{cat}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Liên hệ</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3"><Mail className="w-4 h-4" /> tsubame.arts@gmail.com</li>
                <li className="flex items-center gap-3"><MapPin className="w-4 h-4" /> Ho Chi Minh City</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[13px]">
            <p>© {new Date().getFullYear()} Tsubame's Sticker Shop. Crafted with 💖 by Tsubame.arts</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══ Back to Top ═══ */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-primary text-primary-foreground rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
