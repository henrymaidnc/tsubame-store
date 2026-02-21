import { useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  useEffect(() => {
    const title = "Contact Tsubame Art — Get in Touch";
    const description =
      "Contact Tsubame Art for orders, partnerships, or questions. Reach us by email or social links.";
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (metaDesc) metaDesc.setAttribute("content", description);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Contact Us</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Have a question or collaboration idea? We’d love to hear from you.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <a href="mailto:info@tsubame-store.com" className="rounded-xl border border-border p-5 bg-card hover:bg-muted">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4" />
              <p className="text-sm font-semibold">Email</p>
            </div>
            <p className="text-sm text-muted-foreground">info@tsubame-store.com</p>
          </a>
          <div className="rounded-xl border border-border p-5 bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4" />
              <p className="text-sm font-semibold">Phone</p>
            </div>
            <p className="text-sm text-muted-foreground">+84 123 456 789</p>
          </div>
          <div className="rounded-xl border border-border p-5 bg-card">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4" />
              <p className="text-sm font-semibold">Location</p>
            </div>
            <p className="text-sm text-muted-foreground">Hanoi, Vietnam</p>
          </div>
        </div>
      </section>
    </main>
  );
}
