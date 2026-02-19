import {
  monthlySales,
  productPerformance,
  categoryDistribution,
} from "@/data/mockData";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, DollarSign, Users, Package, Activity } from "lucide-react";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--destructive))",
];

const kpis = [
  {
    label: "Total Revenue",
    value: "384,860,000đ",
    change: "+18%",
    positive: true,
    icon: DollarSign,
    color: "text-primary",
    bg: "bg-primary/15",
  },
  {
    label: "Top Month",
    value: "38,488",
    change: "Nov 2025",
    positive: true,
    icon: TrendingUp,
    color: "text-success",
    bg: "bg-success/15",
  },
  {
    label: "Active Distributors",
    value: "5",
    change: "+1 this quarter",
    positive: true,
    icon: Users,
    color: "text-accent",
    bg: "bg-accent/15",
  },
  {
    label: "Total Products",
    value: "10",
    change: "3 categories",
    positive: true,
    icon: Package,
    color: "text-warning",
    bg: "bg-warning/15",
  },
];

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  color: "hsl(var(--card-foreground))",
  fontSize: "12px",
};

export default function Analytics() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Sales performance, distributor activity & product metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(({ label, value, change, positive, icon: Icon, color, bg }) => (
          <div key={label} className="card-glass rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <span
                className={`text-xs font-semibold ${positive ? "text-success" : "text-destructive"}`}
              >
                {change}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Trend */}
      <div className="card-glass rounded-xl p-5">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-foreground">
            Monthly Sales Trend
          </h2>
          <p className="text-xs text-muted-foreground">
            Total units sold per month (2024–2025)
          </p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={monthlySales} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(185, 85%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(185, 85%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={2}
            />
            <YAxis
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="hsl(185, 85%, 50%)"
              strokeWidth={2}
              fill="url(#salesGradient)"
              dot={false}
              activeDot={{ r: 5, fill: "hsl(185, 85%, 50%)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Distributor Performance Bar Chart */}
        <div className="card-glass rounded-xl p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-foreground">
              Distributor Performance
            </h2>
            <p className="text-xs text-muted-foreground">Revenue by distributor (×1000đ)</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={productPerformance} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v.toLocaleString()}`, "Revenue (×1000đ)"]} />
              <Bar dataKey="sales" radius={[0, 6, 6, 0]}>
                {productPerformance.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div className="card-glass rounded-xl p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-foreground">
              Category Distribution
            </h2>
            <p className="text-xs text-muted-foreground">Share of sales by product category</p>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categoryDistribution.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="card-glass rounded-xl p-5">
        <h2 className="text-base font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { user: "Admin", action: "Updated stock for Wagashi Sticker", time: "2 mins ago", color: "bg-primary" },
            { user: "Shopee", action: "Placed bulk order – 50 units Charm Spring", time: "1 hour ago", color: "bg-accent" },
            { user: "Admin", action: "Added new product: Clay Fox Figurine", time: "3 hours ago", color: "bg-primary" },
            { user: "Konbini 30%", action: "Delivery confirmed – batch STK-2025-001", time: "Yesterday", color: "bg-success" },
            { user: "Admin", action: "Exported sales report to PDF", time: "Yesterday", color: "bg-warning" },
          ].map((log, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${log.color}`} />
              <div className="flex-1">
                <span className="font-medium text-foreground">{log.user}</span>
                <span className="text-muted-foreground"> — {log.action}</span>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
