import { useEffect } from "react";
import { ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  useEffect(() => {
    const title = "About Tsubame Art — Handmade Prints & Gifts";
    const description =
      "Learn about Tsubame Art: handmade fox-themed prints, stickers, and gifts crafted with care in Vietnam.";
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (metaDesc) metaDesc.setAttribute("content", description);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">About Tsubame Art</h1>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Tsubame Art creates cute, fox-inspired prints, stickers, charms, and collectibles. Every design is handcrafted with care and packaged with love. We aim to bring a little spark of joy to your day with charming characters and high-quality materials.
        </p>
        <div className="grid gap-4 md:grid-cols-3 mb-10">
          <div className="rounded-xl border border-border p-5 bg-card">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Origin</p>
            <p className="text-sm">Handmade in Vietnam</p>
          </div>
          <div className="rounded-xl border border-border p-5 bg-card">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Quality</p>
            <p className="text-sm">Inspected and packed with care</p>
          </div>
          <div className="rounded-xl border border-border p-5 bg-card">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Shipping</p>
            <p className="text-sm">Fast nationwide delivery</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://shopee.vn/tsubame.arts"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background hover:bg-foreground/90"
          >
            <Sparkles className="w-4 h-4" />
            Shop on Shopee
          </a>
          <a
            href="https://www.instagram.com/tsubame.arts/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted"
          >
            <Sparkles className="w-4 h-4" />
            Follow on Instagram
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted"
          >
            <Sparkles className="w-4 h-4" />
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
