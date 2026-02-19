import { products } from "@/data/mockData";
import { useState, useEffect } from "react";
import { Search, X, ShoppingBag, Star, Heart, Filter, Grid, List, Sparkles, ArrowRight, Menu, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

type Status = "in-stock" | "low-stock" | "out-of-stock";

const statusConfig: Record<Status, { label: string; className: string; color: string }> = {
  "in-stock": { label: "In Stock", className: "bg-emerald-100 text-emerald-700 border-emerald-200", color: "emerald" },
  "low-stock": { label: "Low Stock", className: "bg-amber-100 text-amber-700 border-amber-200", color: "amber" },
  "out-of-stock": { label: "Out of Stock", className: "bg-rose-100 text-rose-700 border-rose-200", color: "rose" },
};

const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under 35,000đ", min: 0, max: 35000 },
  { label: "35,000 – 50,000đ", min: 35000, max: 50000 },
  { label: "50,000đ+", min: 50000, max: Infinity },
];

type Product = typeof products[0];

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const range = priceRanges[priceRange];
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    const matchPrice = p.price >= range.min && p.price <= range.max;
    const matchAvail = !availableOnly || p.status !== "out-of-stock";
    return matchSearch && matchCat && matchPrice && matchAvail;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: number) => favorites.includes(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-xl opacity-30"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-60 right-20 w-40 h-40 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full blur-xl opacity-30"
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-1/4 w-36 h-36 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full blur-xl opacity-30"
        />
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"
                />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Tsubame Store</h1>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {["Products", "About", "Contact"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors relative group"
                >
                  {item}
                  <motion.div
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Admin Portal
                </Link>
              </motion.div>
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-5 h-5" />
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
              className="md:hidden bg-white/90 backdrop-blur-lg border-t border-white/20"
            >
              <div className="px-4 py-4 space-y-3">
                {["Products", "About", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    {item}
                  </a>
                ))}
                <Link 
                  to="/login" 
                  className="block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold text-center"
                >
                  Admin Portal
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome to
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                  Tsubame Store
                </span>
              </h2>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Discover our enchanting collection of fox-themed merchandise, where each piece tells a story of magic and wonder
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.a
                href="#products"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </motion.a>
              
              <motion.a
                href="#about"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-300 hover:border-indigo-300 transition-all duration-300"
              >
                Learn More
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Tsubame Store?</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Experience the perfect blend of quality, creativity, and service</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Star, title: "Premium Quality", description: "Handcrafted with attention to every detail", color: "from-yellow-400 to-orange-500" },
              { icon: Heart, title: "Unique Designs", description: "Exclusive artwork you won't find anywhere else", color: "from-pink-400 to-red-500" },
              { icon: ShoppingBag, title: "Fast Delivery", description: "Quick and secure shipping to your doorstep", color: "from-blue-400 to-indigo-500" }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Collection</h3>
            <p className="text-lg text-gray-600">Browse our curated selection of fox-themed treasures</p>
          </motion.div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 w-5 h-5 -translate-y-1/2 text-gray-400" />
                <motion.input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for your perfect fox companion..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setShowFilters(!showFilters)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </motion.button>
                <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <motion.button
                    onClick={() => setViewMode("grid")}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    className={`p-3 transition-colors ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                  >
                    <Grid className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => setViewMode("list")}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    className={`p-3 transition-colors ${viewMode === "list" ? "bg-gray-100" : ""}`}
                  >
                    <List className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl border border-gray-200 shadow-lg space-y-4"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <motion.button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            category === cat
                              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {cat}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h4>
                    <div className="flex flex-wrap gap-2">
                      {priceRanges.map((r, i) => (
                        <motion.button
                          key={i}
                          onClick={() => setPriceRange(i)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            priceRange === i
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {r.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={availableOnly}
                      onChange={(e) => setAvailableOnly(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Show available items only</span>
                  </motion.label>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Product Grid/List */}
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-lg">No products match your current filters.</p>
            </motion.div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-4"}>
              <AnimatePresence mode="popLayout">
                {filtered.map((product, index) => {
                  const { label, className, color } = statusConfig[product.status];
                  const outOfStock = product.status === "out-of-stock";
                  
                  if (viewMode === "grid") {
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group relative"
                      >
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                            <motion.img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.5 }}
                            />
                            <motion.span
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full border ${className}`}
                            >
                              {label}
                            </motion.span>
                            <motion.button
                              onClick={() => toggleFavorite(product.id)}
                              className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Heart className={`w-4 h-4 transition-colors ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                            </motion.button>
                            <motion.button
                              onClick={() => setQuickView(product)}
                              className="absolute bottom-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Search className="w-4 h-4 text-gray-600" />
                            </motion.button>
                          </div>
                          <div className="p-5">
                            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{product.category}</p>
                            <h3 className="font-bold text-gray-900 mb-3 line-clamp-2">{product.name}</h3>
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {product.price.toLocaleString()}đ
                              </span>
                              <motion.button
                                disabled={outOfStock}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                  outOfStock
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg"
                                }`}
                              >
                                {outOfStock ? "Sold Out" : "Add to Cart"}
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  } else {
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                      >
                        <div className="flex gap-6">
                          <motion.img
                            src={product.image}
                            alt={product.name}
                            className="w-32 h-32 object-cover rounded-xl"
                            whileHover={{ scale: 1.05 }}
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider">{product.category}</p>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                              </div>
                              <motion.button
                                onClick={() => toggleFavorite(product.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                              >
                                <Heart className={`w-5 h-5 transition-colors ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                              </motion.button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                  {product.price.toLocaleString()}đ
                                </span>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${className}`}>
                                  {label}
                                </span>
                              </div>
                              <motion.button
                                disabled={outOfStock}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                  outOfStock
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg"
                                }`}
                              >
                                {outOfStock ? "Sold Out" : "Add to Cart"}
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setQuickView(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={quickView.image}
                  alt={quickView.name}
                  className="w-full h-full object-cover"
                />
                <motion.button
                  onClick={() => setQuickView(null)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-2 uppercase tracking-wider">{quickView.category}</p>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">{quickView.name}</h2>
                  <p className="text-gray-600 text-lg">{quickView.description}</p>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {quickView.price.toLocaleString()}đ
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl">
                    <p className="text-sm text-gray-500 mb-1">Stock</p>
                    <p className="text-xl font-bold text-gray-900">{quickView.stock} units</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl">
                    <p className="text-sm text-gray-500 mb-1">Distributor</p>
                    <p className="text-xl font-bold text-gray-900">{quickView.distributor}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <motion.button
                    disabled={quickView.status === "out-of-stock"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {quickView.status === "out-of-stock" ? "Out of Stock" : "Add to Cart"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavorite(quickView.id)}
                    className="p-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
                  >
                    <Heart className={`w-6 h-6 transition-colors ${isFavorite(quickView.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Tsubame Store</h3>
              </div>
              <p className="text-gray-400">Where magic meets craftsmanship in every fox-themed creation</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Stickers</li>
                <li>Charms</li>
                <li>Packaging</li>
                <li>Clay Items</li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-semibold mb-4">Get in Touch</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>📧 info@tsubame-store.com</li>
                <li>📞 +84 123 456 789</li>
                <li>📍 Hanoi, Vietnam</li>
              </ul>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border-t border-gray-700 pt-8 text-center text-gray-400"
          >
            <p>&copy; 2025 Tsubame Store. All rights reserved. Made with ❤️ and fox magic</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
