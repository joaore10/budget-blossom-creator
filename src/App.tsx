
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import { runInitialSeed } from "@/utils/seedData"; // Importando a função de seed

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CompaniesPage from "./pages/Companies/CompaniesPage";
import CompanyForm from "./pages/Companies/CompanyForm";
import BudgetsPage from "./pages/Budgets/BudgetsPage";
import BudgetForm from "./pages/Budgets/BudgetForm";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Executa o seed inicial ao carregar o aplicativo
runInitialSeed();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Substituindo BrowserRouter por HashRouter que funciona melhor em ambientes de produção */}
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
    </DataProvider>
  </QueryClientProvider>
);

export default App;
