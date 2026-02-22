import { Outlet, NavLink, useLocation, Navigate, Link } from "react-router-dom";
import {
  DollarSign,
  LayoutDashboard,
  ShoppingBag,
  BarChart3,
  Truck,
  LogOut,
  Menu,
  X,
  Store,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import { useState } from "react";
const navItems = [
  { to: "/admin/revenue", label: "Revenue", icon: DollarSign },
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: ShoppingBag },
  { to: "/admin/materials", label: "Materials", icon: Package },
  // { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/distributors", label: "Distributors", icon: Truck },
];


interface AppLayoutProps {
  onLogout: () => void;
  role: string;
}

export default function AppLayout({ onLogout, role }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // derive current title
  const current = navItems.find(n => location.pathname.startsWith(n.to));
  const title = current?.label || "Admin";

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-background border-b border-border flex items-center justify-between px-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
          <span>Menu</span>
        </button>
        <span className="font-semibold">{title}</span>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 md:relative md:z-0 shrink-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${sidebarCollapsed ? "w-20" : "w-60"}`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 glow-primary">
            <Store className="h-5 w-5 text-primary" />
          </div>
          {!sidebarCollapsed && (
            <div className="animate-fade-in flex-1">
              <p className="text-sm font-bold text-foreground">StoreManager</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/15 text-primary glow-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span className="animate-fade-in">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-sidebar-border p-3 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="hidden md:flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            title="Back to site"
          >
            <Store className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Back to site</span>}
          </Link>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            title={sidebarCollapsed ? "Expand" : "Collapse"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronLeft className="h-4 w-4 shrink-0" />
            )}
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex md:hidden w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            {mobileOpen ? <X className="h-4 w-4 shrink-0" /> : <Menu className="h-4 w-4 shrink-0" />}
            <span>{mobileOpen ? "Close" : "Menu"}</span>
          </button>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-destructive/15 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-auto w-full pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
