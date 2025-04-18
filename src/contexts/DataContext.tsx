import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AlternativeBudget, Budget, BudgetItem, Company } from "@/types";
import { defaultPdfTemplate } from "@/lib/pdf-templates";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DataContextType {
  companies: Company[];
  budgets: Budget[];
  alternativeBudgets: AlternativeBudget[];
  addCompany: (company: Omit<Company, "id" | "modelo_pdf"> & { modelo_pdf?: string }) => Promise<string>;
  updateCompany: (company: Company) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  addBudget: (
    budget: Omit<Budget, "id" | "data_criacao" | "empresas_selecionadas_ids"> & {
      empresas_selecionadas_ids: string[];
    }
  ) => Promise<string>;
  updateBudget: (budget: Budget) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  getCompanyById: (id: string) => Company | undefined;
  getBudgetById: (id: string) => Budget | undefined;
  getAlternativeBudgetsByBudgetId: (budgetId: string) => AlternativeBudget[];
  getAlternativeBudgetByCompanyAndBudget: (
    budgetId: string,
    companyId: string
  ) => AlternativeBudget | undefined;
  generateAlternativeBudgets: (budgetId: string) => Promise<string[]>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [alternativeBudgets, setAlternativeBudgets] = useState<AlternativeBudget[]>([]);
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
  }, []);

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
  }, []);

  const addCompany = async (
    company: Omit<Company, "id" | "modelo_pdf"> & { modelo_pdf?: string }
  ): Promise<string> => {
    const id = uuidv4();
    const newCompany = {
      id,
      ...company,
      modelo_pdf: company.modelo_pdf || defaultPdfTemplate.html,
    };

    const { error } = await supabase
      .from('companies')
      .insert(newCompany);

    if (error) {
      console.error('Erro ao adicionar empresa:', error);
      toast.error('Erro ao adicionar empresa');
      throw error;
    }

    toast.success('Empresa adicionada com sucesso');
    return id;
  };

  const updateCompany = async (company: Company): Promise<void> => {
    const { error } = await supabase
      .from('companies')
      .update(company)
      .eq('id', company.id);

    if (error) {
      console.error('Erro ao atualizar empresa:', error);
      toast.error('Erro ao atualizar empresa');
      throw error;
    }

    toast.success('Empresa atualizada com sucesso');
  };

  const deleteCompany = async (id: string): Promise<void> => {
    // Verificar se a empresa está sendo usada em algum orçamento
    const isUsed = budgets.some(
      (b) => b.empresa_base_id === id || b.empresas_selecionadas_ids.includes(id)
    );

    if (isUsed) {
      toast.error('Esta empresa não pode ser excluída pois está sendo usada em um ou mais orçamentos');
      return;
    }

    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir empresa:', error);
      toast.error('Erro ao excluir empresa');
      throw error;
    }

    toast.success('Empresa excluída com sucesso');
  };

  const addBudget = async (
    budget: Omit<Budget, "id" | "data_criacao" | "empresas_selecionadas_ids"> & {
      empresas_selecionadas_ids: string[];
    }
  ): Promise<string> => {
    const id = uuidv4();
    const newBudget = {
      ...budget,
      id,
      data_criacao: new Date().toISOString(),
      empresas_selecionadas_ids: [
        budget.empresa_base_id,
        ...budget.empresas_selecionadas_ids.filter(
          (id) => id !== budget.empresa_base_id
        ),
      ],
    };

    const { error } = await supabase
      .from('budgets')
      .insert(newBudget);

    if (error) {
      console.error('Erro ao adicionar orçamento:', error);
      toast.error('Erro ao criar orçamento');
      throw error;
    }

    console.log('Orçamento adicionado com sucesso:', newBudget);
    toast.success('Orçamento criado com sucesso');
    return id;
  };

  const updateBudget = async (budget: Budget): Promise<void> => {
    // Primeiro, excluir orçamentos alternativos existentes
    const { error: deleteError } = await supabase
      .from('alternative_budgets')
      .delete()
      .eq('orcamento_id', budget.id);

    if (deleteError) {
      console.error('Erro ao excluir orçamentos alternativos:', deleteError);
      toast.error('Erro ao atualizar orçamento');
      throw deleteError;
    }

    // Depois, atualizar o orçamento
    const { error: updateError } = await supabase
      .from('budgets')
      .update(budget)
      .eq('id', budget.id);

    if (updateError) {
      console.error('Erro ao atualizar orçamento:', updateError);
      toast.error('Erro ao atualizar orçamento');
      throw updateError;
    }

    toast.success('Orçamento atualizado com sucesso');
  };

  const deleteBudget = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir orçamento:', error);
      toast.error('Erro ao excluir orçamento');
      throw error;
    }

    toast.success('Orçamento excluído com sucesso');
  };

  const getCompanyById = (id: string): Company | undefined => {
    return companies.find((c) => c.id === id);
  };

  const getBudgetById = (id: string): Budget | undefined => {
    return budgets.find((b) => b.id === id);
  };

  const getAlternativeBudgetsByBudgetId = (budgetId: string): AlternativeBudget[] => {
    return alternativeBudgets.filter((ab) => ab.orcamento_id === budgetId);
  };

  const getAlternativeBudgetByCompanyAndBudget = (
    budgetId: string,
    companyId: string
  ): AlternativeBudget | undefined => {
    return alternativeBudgets.find(
      (ab) => ab.orcamento_id === budgetId && ab.empresa_id === companyId
    );
  };

  const generateAlternativeBudgets = async (budgetId: string): Promise<string[]> => {
    console.log('Gerando orçamentos alternativos para o orçamento:', budgetId);
    
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) {
      console.error('Orçamento não encontrado:', budgetId);
      toast.error('Orçamento não encontrado');
      return [];
    }

    const baseCompanyId = budget.empresa_base_id;
    const otherCompanyIds = budget.empresas_selecionadas_ids.filter(
      (id) => id !== baseCompanyId
    );

    const newAlternativeBudgetIds: string[] = [];
    const newAlternativeBudgets: AlternativeBudget[] = [];

    for (const companyId of otherCompanyIds) {
      const altBudgetId = uuidv4();
      newAlternativeBudgetIds.push(altBudgetId);

      const alternativeItems: BudgetItem[] = budget.itens.map((item) => {
        const increasePercentage = 5 + Math.random() * 15;
        const increaseFactor = 1 + increasePercentage / 100;
        
        return {
          ...item,
          id: uuidv4(),
          valor_unitario: Math.ceil(item.valor_unitario * increaseFactor * 100) / 100,
        };
      });

      const newAltBudget: AlternativeBudget = {
        id: altBudgetId,
        orcamento_id: budgetId,
        empresa_id: companyId,
        itens_com_valores_alterados: alternativeItems,
      };

      newAlternativeBudgets.push(newAltBudget);
    }

    if (newAlternativeBudgets.length > 0) {
      const { error } = await supabase
        .from('alternative_budgets')
        .insert(newAlternativeBudgets);

      if (error) {
        console.error('Erro ao gerar orçamentos alternativos:', error);
        toast.error('Erro ao gerar orçamentos alternativos');
        throw error;
      }

      toast.success(`${otherCompanyIds.length} orçamentos alternativos gerados`);
    } else {
      toast.info('Nenhuma empresa adicional selecionada para gerar orçamentos alternativos');
    }

    return newAlternativeBudgetIds;
  };

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
