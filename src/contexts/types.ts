
import { Company, Budget, AlternativeBudget } from "@/types";

export interface DataContextType {
  companies: Company[];
  budgets: Budget[];
  alternativeBudgets: AlternativeBudget[];
  addCompany: (company: Omit<Company, "id" | "modelo_pdf"> & { modelo_pdf?: string }) => Promise<string>;
  updateCompany: (company: Company) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, "id" | "data_criacao" | "empresas_selecionadas_ids"> & { empresas_selecionadas_ids: string[] }) => Promise<string>;
  updateBudget: (budget: Budget) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  getCompanyById: (id: string) => Company | undefined;
  getBudgetById: (id: string) => Budget | undefined;
  getAlternativeBudgetsByBudgetId: (budgetId: string) => Promise<AlternativeBudget[]>;
  getAlternativeBudgetByCompanyAndBudget: (budgetId: string, companyId: string) => Promise<AlternativeBudget | undefined>;
  generateAlternativeBudgets: (budgetId: string) => Promise<string[]>;
  setAlternativeBudgets: (alternativeBudgets: AlternativeBudget[]) => void;
}
