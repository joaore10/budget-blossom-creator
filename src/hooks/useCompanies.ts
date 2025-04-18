
import { useState, useCallback } from 'react';
import { Company } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useCompanies(initialCompanies: Company[] = []) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);

  const addCompany = useCallback(async (
    company: Omit<Company, "id" | "modelo_pdf"> & { modelo_pdf?: string }
  ): Promise<string> => {
    const newCompany = {
      ...company,
      id: crypto.randomUUID(),
      modelo_pdf: company.modelo_pdf || undefined
    };

    const { error } = await (supabase
      .from('companies' as any)
      .insert(newCompany) as any);

    if (error) {
      console.error('Erro ao adicionar empresa:', error);
      toast.error('Erro ao adicionar empresa');
      throw error;
    }

    toast.success('Empresa adicionada com sucesso');
    return newCompany.id;
  }, []);

  const updateCompany = useCallback(async (company: Company): Promise<void> => {
    const { error } = await (supabase
      .from('companies' as any)
      .update(company)
      .eq('id', company.id) as any);

    if (error) {
      console.error('Erro ao atualizar empresa:', error);
      toast.error('Erro ao atualizar empresa');
      throw error;
    }

    toast.success('Empresa atualizada com sucesso');
  }, []);

  const deleteCompany = useCallback(async (id: string): Promise<void> => {
    const { error } = await (supabase
      .from('companies' as any)
      .delete()
      .eq('id', id) as any);

    if (error) {
      console.error('Erro ao excluir empresa:', error);
      toast.error('Erro ao excluir empresa');
      throw error;
    }

    toast.success('Empresa excluída com sucesso');
  }, []);

  const getCompanyById = useCallback((id: string): Company | undefined => {
    return companies.find((c) => c.id === id);
  }, [companies]);

  return {
    companies,
    setCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
  };
}
