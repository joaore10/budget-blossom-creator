
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useCompanies } from "@/hooks/useCompanies";
import { useBudgets } from "@/hooks/useBudgets";
import { DataContextType } from "./types";
import { supabase } from "@/integrations/supabase/client";
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

  const [loading, setLoading] = useState(true);

  // Carregar dados iniciais do Supabase
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Carregar empresas
        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select('*');
        
        if (companiesError) throw companiesError;
        setCompanies(companiesData || []);

        // Carregar orçamentos
        const { data: budgetsData, error: budgetsError } = await supabase
          .from('budgets')
          .select('*');
        
        if (budgetsError) throw budgetsError;
        setBudgets(budgetsData || []);

        // Carregar orçamentos alternativos
        const { data: altBudgetsData, error: altBudgetsError } = await supabase
          .from('alternative_budgets')
          .select('*');
        
        if (altBudgetsError) throw altBudgetsError;
        setAlternativeBudgets(altBudgetsData || []);

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [setCompanies, setBudgets, setAlternativeBudgets]);

  // Configurar listeners para atualizações em tempo real
  useEffect(() => {
    const companiesChannel = supabase
      .channel('companies-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'companies' },
        (payload) => {
          console.log('Companies change received:', payload);
          // Recarregar empresas quando houver mudanças
          supabase
            .from('companies')
            .select('*')
            .then(({ data }) => {
              if (data) setCompanies(data);
            });
      })
      .subscribe();

    const budgetsChannel = supabase
      .channel('budgets-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'budgets' },
        (payload) => {
          console.log('Budgets change received:', payload);
          // Recarregar orçamentos quando houver mudanças
          supabase
            .from('budgets')
            .select('*')
            .then(({ data }) => {
              if (data) setBudgets(data);
            });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(companiesChannel);
      supabase.removeChannel(budgetsChannel);
    };
  }, [setCompanies, setBudgets]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <DataContext.Provider
      value={{
        companies,
        budgets,
        alternativeBudgets,
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
