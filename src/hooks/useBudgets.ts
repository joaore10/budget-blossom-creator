
import { useState, useCallback } from 'react';
import { Budget, AlternativeBudget } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [alternativeBudgets, setAlternativeBudgets] = useState<AlternativeBudget[]>([]);

  const addBudget = useCallback(async (
    budget: Omit<Budget, "id" | "data_criacao" | "empresas_selecionadas_ids"> & {
      empresas_selecionadas_ids: string[];
    }
  ): Promise<string> => {
    const newBudget = {
      ...budget,
      id: crypto.randomUUID(),
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
      .insert(newBudget as any);

    if (error) {
      console.error('Erro ao adicionar orçamento:', error);
      toast.error('Erro ao criar orçamento');
      throw error;
    }

    toast.success('Orçamento criado com sucesso');
    return newBudget.id;
  }, []);

  const updateBudget = useCallback(async (budget: Budget): Promise<void> => {
    const { error } = await supabase
      .from('budgets')
      .update(budget as any)
      .eq('id', budget.id);

    if (error) {
      console.error('Erro ao atualizar orçamento:', error);
      toast.error('Erro ao atualizar orçamento');
      throw error;
    }

    toast.success('Orçamento atualizado com sucesso');
  }, []);

  const deleteBudget = useCallback(async (id: string): Promise<void> => {
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
  }, []);

  const getBudgetById = useCallback((id: string): Budget | undefined => {
    return budgets.find((b) => b.id === id);
  }, [budgets]);

  const getAlternativeBudgetsByBudgetId = useCallback((budgetId: string): AlternativeBudget[] => {
    return alternativeBudgets.filter((ab) => ab.orcamento_id === budgetId);
  }, [alternativeBudgets]);

  const getAlternativeBudgetByCompanyAndBudget = useCallback(
    (budgetId: string, companyId: string): AlternativeBudget | undefined => {
      return alternativeBudgets.find(
        (ab) => ab.orcamento_id === budgetId && ab.empresa_id === companyId
      );
    },
    [alternativeBudgets]
  );

  const generateAlternativeBudgets = useCallback(async (budgetId: string): Promise<string[]> => {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) {
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
      const altBudgetId = crypto.randomUUID();
      newAlternativeBudgetIds.push(altBudgetId);

      const alternativeItems = budget.itens.map((item) => {
        const increasePercentage = 5 + Math.random() * 15;
        const increaseFactor = 1 + increasePercentage / 100;
        
        return {
          ...item,
          id: crypto.randomUUID(),
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
        .insert(newAlternativeBudgets as any);

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
  }, [budgets]);

  return {
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
  };
}
