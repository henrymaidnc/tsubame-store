import { useState } from "react";
import { Store, Eye, EyeOff } from "lucide-react";

const CREDENTIALS = [
  { email: "admin@store.com", password: "admin123", role: "admin" },
  { email: "distributor@store.com", password: "dist123", role: "distributor" },
  { email: "customer@store.com", password: "cust123", role: "customer" },
];

interface LoginProps {
  onLogin: (role: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const user = CREDENTIALS.find(
        (c) => c.email === email && c.password === password
      );
      if (user) {
        onLogin(user.role);
      } else {
        setError("Invalid email or password.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/8 blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 glow-primary">
            <Store className="h-7 w-7 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold gradient-text">StoreManager</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to your account
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="card-glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@store.com"
                className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-2.5 text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors glow-primary"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
            <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Demo Credentials
            </p>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p>
                <span className="text-primary font-medium">Admin:</span>{" "}
                admin@store.com / admin123
              </p>
              <p>
                <span className="text-accent font-medium">Distributor:</span>{" "}
                distributor@store.com / dist123
              </p>
              <p>
                <span className="text-success font-medium">Customer:</span>{" "}
                customer@store.com / cust123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
