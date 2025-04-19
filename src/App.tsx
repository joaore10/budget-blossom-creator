
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import { ResponsiveProvider } from "@/contexts/ResponsiveContext";
import { runInitialSeed } from "@/utils/seedData";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CompaniesPage from "./pages/Companies/CompaniesPage";
import CompanyForm from "./pages/Companies/CompanyForm";
import BudgetsPage from "./pages/Budgets/BudgetsPage";
import BudgetForm from "./pages/Budgets/BudgetForm";

const queryClient = new QueryClient();

// Executa o seed inicial ao carregar o aplicativo
runInitialSeed();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <ResponsiveProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/empresas" element={<CompaniesPage />} />
              <Route path="/empresas/nova" element={<CompanyForm />} />
              <Route path="/empresas/editar/:id" element={<CompanyForm />} />
              <Route path="/orcamentos" element={<BudgetsPage />} />
              <Route path="/orcamentos/novo" element={<BudgetForm />} />
              <Route path="/orcamentos/editar/:id" element={<BudgetForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </ResponsiveProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
