
import { useState, useCallback, useEffect } from 'react';
import { Company } from '@/types';
import { dbService } from '@/services/DatabaseService';
import { toast } from 'sonner';

export function useCompanies(initialCompanies: Company[] = []) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);

  // Carrega as empresas ao iniciar
  useEffect(() => {
    const loadCompanies = () => {
      try {
        const companiesData = dbService.getAllCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
        toast.error('Erro ao carregar empresas');
      }
    };

    loadCompanies();
  }, []);

  const addCompany = useCallback(async (
    company: Omit<Company, "id"> & { modelo_pdf?: string }
  ): Promise<string> => {
    try {
      const id = dbService.createCompany(company);
      const newCompany = { ...company, id, modelo_pdf: company.modelo_pdf || "" };
      setCompanies(prev => [...prev, newCompany as Company]);
      toast.success('Empresa adicionada com sucesso');
      return id;
    } catch (error) {
      console.error('Erro ao adicionar empresa:', error);
      toast.error('Erro ao adicionar empresa');
      throw error;
    }
  }, []);

  const updateCompany = useCallback(async (company: Company): Promise<void> => {
    try {
      dbService.updateCompany(company);
      setCompanies(prev => 
        prev.map(c => c.id === company.id ? company : c)
      );
      toast.success('Empresa atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      toast.error('Erro ao atualizar empresa');
      throw error;
    }
  }, []);

  const deleteCompany = useCallback(async (id: string): Promise<void> => {
    try {
      dbService.deleteCompany(id);
      setCompanies(prev => prev.filter(c => c.id !== id));
      toast.success('Empresa excluída com sucesso');
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      toast.error('Erro ao excluir empresa');
      throw error;
    }
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
