import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import HowItWorks from "./pages/HowItWorks";
import Benefits from "./pages/Benefits";
import Impact from "./pages/Impact";
import NotFound from "./pages/NotFound";
import ScheduleCollection from "./pages/ScheduleCollection";
import Certificate from "./pages/Certificate";
import Reports from "./pages/Reports";
import Goals from "./pages/Goals";
import Traceability from "./pages/Traceability";
import CollectionMap from "./pages/CollectionMap";
import AdminUsers from "./pages/AdminUsers";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/usuarios" element={<AdminUsers />} />
              <Route path="/programar-recoleccion" element={<ScheduleCollection />} />
              <Route path="/certificado" element={<Certificate />} />
              <Route path="/reportes" element={<Reports />} />
              <Route path="/metas" element={<Goals />} />
              <Route path="/trazabilidad" element={<Traceability />} />
              <Route path="/mapa-recoleccion" element={<CollectionMap />} />
              <Route path="/como-funciona" element={<HowItWorks />} />
              <Route path="/beneficios" element={<Benefits />} />
              <Route path="/impacto" element={<Impact />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
