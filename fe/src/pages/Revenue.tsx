import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, TrendingUp, DollarSign } from "lucide-react";

// Sample data based on the image
const revenueData = [
  { month: "May 2024", konbini: 45000000, shopee: 38000000, washi: 32000000, arimi: 28000000, airy: 25000000, total: 168000000 },
  { month: "Jun 2024", konbini: 48000000, shopee: 42000000, washi: 35000000, arimi: 30000000, airy: 27000000, total: 182000000 },
  { month: "Jul 2024", konbini: 52000000, shopee: 45000000, washi: 38000000, arimi: 32000000, airy: 29000000, total: 196000000 },
  { month: "Aug 2024", konbini: 55000000, shopee: 48000000, washi: 40000000, arimi: 35000000, airy: 31000000, total: 209000000 },
  { month: "Sep 2024", konbini: 58000000, shopee: 50000000, washi: 42000000, arimi: 37000000, airy: 33000000, total: 220000000 },
  { month: "Oct 2024", konbini: 60000000, shopee: 52000000, washi: 44000000, arimi: 39000000, airy: 35000000, total: 230000000 },
  { month: "Nov 2024", konbini: 62000000, shopee: 54000000, washi: 46000000, arimi: 41000000, airy: 37000000, total: 240000000 },
  { month: "Dec 2024", konbini: 65000000, shopee: 58000000, washi: 50000000, arimi: 45000000, airy: 40000000, total: 258000000 },
  { month: "Jan 2025", konbini: 48000000, shopee: 42000000, washi: 35000000, arimi: 30000000, airy: 27000000, total: 182000000 },
  { month: "Feb 2025", konbini: 50000000, shopee: 44000000, washi: 37000000, arimi: 32000000, airy: 28000000, total: 191000000 },
  { month: "Mar 2025", konbini: 53000000, shopee: 46000000, washi: 39000000, arimi: 34000000, airy: 30000000, total: 202000000 },
  { month: "Apr 2025", konbini: 55000000, shopee: 48000000, washi: 41000000, arimi: 36000000, airy: 32000000, total: 212000000 },
  { month: "May 2025", konbini: 57000000, shopee: 50000000, washi: 43000000, arimi: 38000000, airy: 34000000, total: 222000000 },
  { month: "Jun 2025", konbini: 59000000, shopee: 52000000, washi: 45000000, arimi: 40000000, airy: 36000000, total: 232000000 },
  { month: "Jul 2025", konbini: 61000000, shopee: 54000000, washi: 47000000, arimi: 42000000, airy: 38000000, total: 242000000 },
  { month: "Aug 2025", konbini: 63000000, shopee: 56000000, washi: 49000000, arimi: 44000000, airy: 40000000, total: 252000000 },
  { month: "Sep 2025", konbini: 65000000, shopee: 58000000, washi: 51000000, arimi: 46000000, airy: 42000000, total: 262000000 },
  { month: "Oct 2025", konbini: 67000000, shopee: 60000000, washi: 53000000, arimi: 48000000, airy: 44000000, total: 272000000 },
  { month: "Nov 2025", konbini: 69000000, shopee: 62000000, washi: 55000000, arimi: 50000000, airy: 46000000, total: 282000000 },
  { month: "Dec 2025", konbini: 72000000, shopee: 65000000, washi: 58000000, arimi: 53000000, airy: 48000000, total: 296000000 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatShortCurrency = (value: number) => {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
};

export default function Revenue() {
  const [timeRange, setTimeRange] = useState("all");

  const filteredData = timeRange === "all" 
    ? revenueData 
    : timeRange === "2024" 
    ? revenueData.filter(d => d.month.includes("2024"))
    : revenueData.filter(d => d.month.includes("2025"));

  const totalRevenue = filteredData.reduce((sum, item) => sum + item.total, 0);
  const averageRevenue = totalRevenue / filteredData.length;
  const maxRevenue = Math.max(...filteredData.map(item => item.total));
  const minRevenue = Math.min(...filteredData.map(item => item.total));

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Revenue Analytics</h2>
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-4 w-4" />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredData.length} months
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Per month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(maxRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Peak performance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(minRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Minimum revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Channel Comparison</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Monthly revenue trends across all channels
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tickFormatter={formatShortCurrency}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: "#000" }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Total Revenue"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Channel Comparison</CardTitle>
              <CardDescription>
                Revenue breakdown by distribution channel
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tickFormatter={formatShortCurrency}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: "#000" }}
                  />
                  <Legend />
                  <Bar dataKey="konbini" stackId="a" fill="#8884d8" name="Konbini 30%" />
                  <Bar dataKey="shopee" stackId="a" fill="#82ca9d" name="Shopee" />
                  <Bar dataKey="washi" stackId="a" fill="#ffc658" name="Washi 30%" />
                  <Bar dataKey="arimi" stackId="a" fill="#ff7c7c" name="Arimi" />
                  <Bar dataKey="airy" stackId="a" fill="#8dd1e1" name="Airy" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Channel Trends</CardTitle>
              <CardDescription>
                Individual channel performance over time
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tickFormatter={formatShortCurrency}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: "#000" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="konbini" stroke="#8884d8" name="Konbini 30%" />
                  <Line type="monotone" dataKey="shopee" stroke="#82ca9d" name="Shopee" />
                  <Line type="monotone" dataKey="washi" stroke="#ffc658" name="Washi 30%" />
                  <Line type="monotone" dataKey="arimi" stroke="#ff7c7c" name="Arimi" />
                  <Line type="monotone" dataKey="airy" stroke="#8dd1e1" name="Airy" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
