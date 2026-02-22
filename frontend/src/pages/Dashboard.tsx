import { distributorTimeline, timelineMonths } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { useState } from "react";

type SortField = "name" | "total";

export default function Dashboard() {
  const [sortBy, setSortBy] = useState<SortField>("total");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Calculate totals for each distributor
  const distributorTotals = distributorTimeline.map((row) => {
    const distributorData = row as any;
    const total = timelineMonths.reduce((sum, month) => sum + (distributorData[month] || 0), 0);
    return {
      distributor: row.distributor,
      total,
      ...distributorData,
    };
  });

  // Sort data
  const sorted = [...distributorTotals].sort((a, b) => {
    const mult = sortDir === "asc" ? 1 : -1;
    if (sortBy === "name") return mult * a.distributor.localeCompare(b.distributor);
    return mult * (a.total - b.total);
  });

  const toggleSort = (field: SortField) => {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(field); setSortDir("desc"); }
  };

  // Get color for heatmap based on value
  const getHeatColor = (value: number, max: number) => {
    if (value === 0) return "bg-muted/50";
    const ratio = value / max;
    if (ratio > 0.7) return "bg-yellow-300/80 text-yellow-900 font-semibold";
    if (ratio > 0.5) return "bg-green-200/70 text-green-900";
    if (ratio > 0.3) return "bg-blue-200/70 text-blue-900";
    return "bg-blue-100/50 text-foreground";
  };

  const maxValue = Math.max(...timelineMonths.map((m) => Math.max(...sorted.map((d) => (d as any)[m] || 0))));

  // Prepare chart data - top distributors
  const chartData = sorted.filter((d) => d.total > 0).sort((a, b) => b.total - a.total).slice(0, 10);

  // Trend data - monthly totals
  const trendData = timelineMonths.map((month) => ({
    month,
    total: sorted.reduce((sum, d) => sum + ((d as any)[month] || 0), 0),
  }));

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Sales Dashboard</h1>
        <p className="text-sm text-muted-foreground">Distributor performance timeline</p>
      </div>

      {/* Distributor Timeline Heatmap Table */}
      <div className="card-glass rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-base font-semibold text-foreground">Distributor Sales Timeline</h2>
            <div className="flex gap-2 text-xs flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-6 h-4 bg-yellow-300/80 rounded" />
                <span className="text-muted-foreground">High (70%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-4 bg-green-200/70 rounded" />
                <span className="text-muted-foreground">Medium (50-70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-4 bg-blue-200/70 rounded" />
                <span className="text-muted-foreground">Low (30-50%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            {/* Header */}
            <thead className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border">
              <tr>
                <th className="sticky left-0 z-10 bg-background/90 backdrop-blur-sm p-3 text-left font-semibold text-foreground w-40">
                  <button
                    onClick={() => toggleSort("name")}
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    Distributor
                    {sortBy === "name" && (sortDir === "asc" ? " ↑" : " ↓")}
                  </button>
                </th>
                {timelineMonths.map((month) => (
                  <th key={month} className="p-2 text-center font-semibold text-muted-foreground text-xs min-w-16">
                    {month}
                  </th>
                ))}
                <th className="sticky right-0 z-10 bg-background/90 backdrop-blur-sm p-3 text-center font-semibold text-foreground min-w-20">
                  <button
                    onClick={() => toggleSort("total")}
                    className="hover:text-primary transition-colors"
                  >
                    Total {sortBy === "total" && (sortDir === "asc" ? " ↑" : " ↓")}
                  </button>
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-border">
              {sorted.map((row) => (
                <tr key={row.distributor} className="hover:bg-muted/40 transition-colors">
                  <td className="sticky left-0 z-10 bg-background p-3 font-medium text-foreground whitespace-nowrap">
                    {row.distributor}
                  </td>
                  {timelineMonths.map((month) => {
                    const value = (row as any)[month] || 0;
                    return (
                      <td
                        key={`${row.distributor}-${month}`}
                        className={`p-2 text-center font-semibold text-xs transition-colors ${getHeatColor(
                          value,
                          maxValue
                        )}`}
                      >
                        {value > 0 ? (value / 1000).toFixed(1) : "–"}
                      </td>
                    );
                  })}
                  <td className="sticky right-0 z-10 bg-background p-3 text-center font-bold text-primary">
                    {(row.total / 1000).toFixed(1)}k
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-border bg-muted/30 text-xs text-muted-foreground">
          Note: Values are in thousands (k). Cells are color-coded by percentage of highest value in each month.
        </div>
      </div>

      {/* Top Distributors Bar Chart */}
      <div className="card-glass rounded-xl p-5">
        <h2 className="text-base font-semibold text-foreground mb-4">Top Distributors by Total Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="distributor"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              formatter={(value: any) => [`${value.toLocaleString()}`, "Total Sales"]}
              labelStyle={{ color: "hsl(var(--card-foreground))" }}
            />
            <Bar dataKey="total" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Sales Trend */}
      <div className="card-glass rounded-xl p-5">
        <h2 className="text-base font-semibold text-foreground mb-4">Monthly Sales Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              formatter={(value: any) => `${value.toLocaleString()}`}
              labelStyle={{ color: "hsl(var(--card-foreground))" }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
