import { useState, useCallback, useEffect } from 'react';
import { Budget, AlternativeBudget } from '@/types';
import { dbService } from '@/services/DatabaseService';
import { toast } from 'sonner';

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [alternativeBudgets, setAlternativeBudgets] = useState<AlternativeBudget[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadBudgets = async () => {
      setIsLoading(true);
      try {
        const budgetsData = await dbService.getAllBudgets();
        setBudgets(budgetsData);
      } catch (error) {
        console.error('Erro ao carregar orçamentos:', error);
        toast.error('Erro ao carregar orçamentos');
      } finally {
        setIsLoading(false);
      }
    };

    loadBudgets();
  }, []);

  const addBudget = useCallback(async (
    budget: Omit<Budget, "id" | "data_criacao" | "empresas_selecionadas_ids"> & {
      empresas_selecionadas_ids: string[];
    }
  ): Promise<string> => {
    try {
      const newBudget = {
        ...budget,
        empresas_selecionadas_ids: [
          budget.empresa_base_id,
          ...budget.empresas_selecionadas_ids.filter(
            (id) => id !== budget.empresa_base_id
          ),
        ],
      };

      const id = await dbService.createBudget(newBudget);
      setBudgets(prev => [...prev, { ...newBudget, id, data_criacao: new Date().toISOString() }]);
      toast.success('Orçamento criado com sucesso');
      return id;
    } catch (error) {
      console.error('Erro ao adicionar orçamento:', error);
      toast.error('Erro ao criar orçamento');
      throw error;
    }
  }, []);

  const updateBudget = useCallback(async (budget: Budget): Promise<void> => {
    try {
      await dbService.updateBudget(budget);
      setBudgets(prev => 
        prev.map(b => b.id === budget.id ? budget : b)
      );
      toast.success('Orçamento atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      toast.error('Erro ao atualizar orçamento');
      throw error;
    }
  }, []);

  const deleteBudget = useCallback(async (id: string): Promise<void> => {
    try {
      const altBudgets = await dbService.getAlternativeBudgets(id);
      
      await dbService.deleteBudget(id);
      
      setBudgets(prev => prev.filter(b => b.id !== id));
      setAlternativeBudgets(prev => 
        prev.filter(ab => ab.orcamento_id !== id)
      );
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error);
      throw error;
    }
  }, []);

  const getBudgetById = useCallback((id: string): Budget | undefined => {
    return budgets.find((b) => b.id === id);
  }, [budgets]);

  const getAlternativeBudgetsByBudgetId = useCallback(async (budgetId: string): Promise<AlternativeBudget[]> => {
    try {
      const altBudgets = await dbService.getAlternativeBudgets(budgetId);
      return altBudgets;
    } catch (error) {
      console.error('Erro ao buscar orçamentos alternativos:', error);
      toast.error('Erro ao buscar orçamentos alternativos');
      return [];
    }
  }, []);

  const getAlternativeBudgetByCompanyAndBudget = useCallback(
    async (budgetId: string, companyId: string): Promise<AlternativeBudget | undefined> => {
      try {
        const altBudgets = await dbService.getAlternativeBudgets(budgetId);
        return altBudgets.find(ab => ab.empresa_id === companyId);
      } catch (error) {
        console.error('Erro ao buscar orçamento alternativo:', error);
        toast.error('Erro ao buscar orçamento alternativo');
        return undefined;
      }
    },
    []
  );

  const generateAlternativeBudgets = useCallback(async (budgetId: string, maxRange: number = 10): Promise<string[]> => {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) {
      toast.error('Orçamento não encontrado');
      return [];
    }

    try {
      const baseCompanyId = budget.empresa_base_id;
      const otherCompanyIds = budget.empresas_selecionadas_ids.filter(
        (id) => id !== baseCompanyId
      );

      if (otherCompanyIds.length === 0) {
        toast.info('Nenhuma empresa adicional selecionada para gerar orçamentos alternativos');
        return [];
      }

      const newIds: string[] = [];
      const existingAlts = await dbService.getAlternativeBudgets(budgetId);

      for (const companyId of otherCompanyIds) {
        const existingAlt = existingAlts.find(alt => alt.empresa_id === companyId);
        
        const alternativeItems = budget.itens.map((item) => {
          const increasePercentage = 1 + Math.random() * (maxRange - 1);
          const increaseFactor = 1 + increasePercentage / 100;
          
          return {
            ...item,
            id: crypto.randomUUID(),
            valor_unitario: Math.ceil(item.valor_unitario * increaseFactor * 100) / 100,
          };
        });

        if (existingAlt) {
          await dbService.updateAlternativeBudget({
            ...existingAlt,
            itens_com_valores_alterados: alternativeItems,
          });
          newIds.push(existingAlt.id);
        } else {
          const newAltBudget: Omit<AlternativeBudget, "id"> = {
            orcamento_id: budgetId,
            empresa_id: companyId,
            itens_com_valores_alterados: alternativeItems,
          };

          const id = await dbService.createAlternativeBudget(newAltBudget);
          newIds.push(id);
        }
      }

      for (const existingAlt of existingAlts) {
        if (!otherCompanyIds.includes(existingAlt.empresa_id)) {
          await dbService.deleteAlternativeBudget(existingAlt.id);
        }
      }

      const updatedAlternatives = await dbService.getAlternativeBudgets(budgetId);
      setAlternativeBudgets(prev => [
        ...prev.filter(ab => ab.orcamento_id !== budgetId),
        ...updatedAlternatives
      ]);

      if (newIds.length > 0) {
        toast.success(`${newIds.length} orçamentos alternativos gerados`);
      }

      return newIds;
    } catch (error) {
      console.error('Erro ao gerar orçamentos alternativos:', error);
      toast.error('Erro ao gerar orçamentos alternativos');
      throw error;
    }
  }, [budgets]);

  return {
    budgets,
    isLoading,
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
