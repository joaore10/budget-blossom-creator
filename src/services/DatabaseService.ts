
import { db, statements } from '../db/database';
import { Company, Budget, AlternativeBudget } from '@/types';

class DatabaseService {
  // Companies
  getAllCompanies(): Company[] {
    return statements.companies.getAll.all().map(row => ({
      ...row,
      modelo_pdf: row.modelo_pdf || undefined
    }));
  }

  getCompanyById(id: string): Company | undefined {
    const row = statements.companies.getById.get(id);
    if (!row) return undefined;
    return {
      ...row,
      modelo_pdf: row.modelo_pdf || undefined
    };
  }

  createCompany(company: Omit<Company, "id">): string {
    const id = crypto.randomUUID();
    statements.companies.insert.run(
      id,
      company.nome,
      company.cnpj,
      company.representante,
      company.endereco || null,
      company.modelo_pdf || null
    );
    return id;
  }

  updateCompany(company: Company): void {
    statements.companies.update.run(
      company.nome,
      company.cnpj,
      company.representante,
      company.endereco || null,
      company.modelo_pdf || null,
      company.id
    );
  }

  deleteCompany(id: string): void {
    statements.companies.delete.run(id);
  }

  // Budgets
  getAllBudgets(): Budget[] {
    return statements.budgets.getAll.all().map(row => ({
      ...row,
      empresas_selecionadas_ids: JSON.parse(row.empresas_selecionadas_ids),
      itens: JSON.parse(row.itens)
    }));
  }

  getBudgetById(id: string): Budget | undefined {
    const row = statements.budgets.getById.get(id);
    if (!row) return undefined;
    return {
      ...row,
      empresas_selecionadas_ids: JSON.parse(row.empresas_selecionadas_ids),
      itens: JSON.parse(row.itens)
    };
  }

  createBudget(budget: Omit<Budget, "id" | "data_criacao">): string {
    const id = crypto.randomUUID();
    statements.budgets.insert.run(
      id,
      budget.cliente,
      budget.empresa_base_id,
      JSON.stringify(budget.empresas_selecionadas_ids),
      JSON.stringify(budget.itens)
    );
    return id;
  }

  updateBudget(budget: Budget): void {
    statements.budgets.update.run(
      budget.cliente,
      budget.empresa_base_id,
      JSON.stringify(budget.empresas_selecionadas_ids),
      JSON.stringify(budget.itens),
      budget.id
    );
  }

  deleteBudget(id: string): void {
    db.transaction(() => {
      statements.alternativeBudgets.delete.run(id);
      statements.budgets.delete.run(id);
    })();
  }

  // Alternative Budgets
  getAlternativeBudgets(budgetId: string): AlternativeBudget[] {
    return statements.alternativeBudgets.getByBudgetId.all(budgetId).map(row => ({
      ...row,
      itens_com_valores_alterados: JSON.parse(row.itens_com_valores_alterados)
    }));
  }

  createAlternativeBudget(altBudget: Omit<AlternativeBudget, "id">): string {
    const id = crypto.randomUUID();
    statements.alternativeBudgets.insert.run(
      id,
      altBudget.orcamento_id,
      altBudget.empresa_id,
      JSON.stringify(altBudget.itens_com_valores_alterados)
    );
    return id;
  }
}

export const dbService = new DatabaseService();
