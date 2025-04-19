
import { createContext, ReactNode, useContext } from "react";
import { useCompanies } from "@/hooks/useCompanies";
import { useBudgets } from "@/hooks/useBudgets";
import { DataContextType } from "./types";
import { toast } from "sonner";

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const {
    companies,
    setCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
  } = useCompanies();

  const {
    budgets,
    setBudgets,
    alternativeBudgets,
    setAlternativeBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetById,
    getAlternativeBudgetsByBudgetId,
    getAlternativeBudgetByCompanyAndBudget,
    generateAlternativeBudgets,
  } = useBudgets();

  return (
    <DataContext.Provider
      value={{
        companies,
        budgets,
        alternativeBudgets,
        setAlternativeBudgets,
        addCompany,
        updateCompany,
        deleteCompany,
        addBudget,
        updateBudget,
        deleteBudget,
        getCompanyById,
        getBudgetById,
        getAlternativeBudgetsByBudgetId,
        getAlternativeBudgetByCompanyAndBudget,
        generateAlternativeBudgets,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
