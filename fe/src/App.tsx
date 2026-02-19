import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Catalog from "./pages/Catalog";
import Analytics from "./pages/Analytics";
import Distributors from "./pages/Distributors";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  const [role, setRole] = useState<string | null>(null);

  const handleLogin = (userRole: string) => setRole(userRole);
  const handleLogout = () => setRole(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!role ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Routes>
              <Route element={<AppLayout onLogout={handleLogout} role={role} />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/distributors" element={<Distributors />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
