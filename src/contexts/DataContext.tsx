
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AlternativeBudget, Budget, BudgetItem, Company } from "@/types";
import { defaultPdfTemplate, pdfTemplates } from "@/lib/pdf-templates";
import { toast } from "sonner";

interface DataContextType {
  companies: Company[];
  budgets: Budget[];
  alternativeBudgets: AlternativeBudget[];
  addCompany: (company: Omit<Company, "id" | "modelo_pdf"> & { modelo_pdf?: string }) => string;
  updateCompany: (company: Company) => void;
  deleteCompany: (id: string) => void;
  addBudget: (
    budget: Omit<Budget, "id" | "data_criacao" | "empresas_selecionadas_ids"> & {
      empresas_selecionadas_ids: string[];
    }
  ) => string;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
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

// Initial seed data for companies
const initialCompanies: Company[] = [
  {
    id: uuidv4(),
    nome: "Maria Beatriz Pereira Alves",
    cnpj: "58.188.536/0001-62",
    representante: "Maria Beatriz Pereira Alves",
    endereco: "Ourinhos, SP",
    modelo_pdf: pdfTemplates.template1,
  },
  {
    id: uuidv4(),
    nome: "Laura dos Santos Sakai - MEI",
    cnpj: "52.928.895/0001-22",
    representante: "Laura dos Santos Sakai",
    endereco: "Campinas, SP",
    modelo_pdf: pdfTemplates.template2,
  },
  {
    id: uuidv4(),
    nome: "Daniele Fabricia dos Santos",
    cnpj: "52.019.295/0001-41",
    representante: "Daniele Fabricia dos Santos",
    endereco: "São Paulo, SP",
    modelo_pdf: pdfTemplates.template3,
  },
];

// Helper function to safely save data to localStorage
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} data to localStorage:`, error);
    toast.error(`Erro ao salvar dados de ${key}`);
    return false;
  }
};

// Helper function to safely load data from localStorage
const loadFromLocalStorage = (key: string, defaultValue: any) => {
  try {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} data from localStorage:`, error);
    toast.error(`Erro ao carregar dados salvos de ${key}`);
    return defaultValue;
  }
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [alternativeBudgets, setAlternativeBudgets] = useState<AlternativeBudget[]>([]);
  const [dataInitialized, setDataInitialized] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    if (dataInitialized) return;
    
    const savedCompanies = loadFromLocalStorage("companies", initialCompanies);
    const savedBudgets = loadFromLocalStorage("budgets", []);
    const savedAlternativeBudgets = loadFromLocalStorage("alternativeBudgets", []);

    setCompanies(savedCompanies);
    setBudgets(savedBudgets);
    setAlternativeBudgets(savedAlternativeBudgets);
    setDataInitialized(true);
    
    console.log("Data loaded from localStorage:", {
      companies: savedCompanies.length,
      budgets: savedBudgets.length,
      alternativeBudgets: savedAlternativeBudgets.length
    });
  }, [dataInitialized]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!dataInitialized) return;
    
    console.log("Saving data to localStorage:", {
      companies: companies.length,
      budgets: budgets.length,
      alternativeBudgets: alternativeBudgets.length
    });
    
    saveToLocalStorage("companies", companies);
    saveToLocalStorage("budgets", budgets);
    saveToLocalStorage("alternativeBudgets", alternativeBudgets);
  }, [companies, budgets, alternativeBudgets, dataInitialized]);

  const addCompany = (
    company: Omit<Company, "id" | "modelo_pdf"> & { modelo_pdf?: string }
  ): string => {
    const id = uuidv4();
    const newCompany: Company = {
      ...company,
      id,
      modelo_pdf: company.modelo_pdf || defaultPdfTemplate.html,
    };
    
    const updatedCompanies = [...companies, newCompany];
    setCompanies(updatedCompanies);
    saveToLocalStorage("companies", updatedCompanies);
    
    toast.success("Empresa adicionada com sucesso");
    return id;
  };

  const updateCompany = (company: Company) => {
    const updatedCompanies = companies.map((c) => (c.id === company.id ? company : c));
    setCompanies(updatedCompanies);
    saveToLocalStorage("companies", updatedCompanies);
    
    toast.success("Empresa atualizada com sucesso");
  };

  const deleteCompany = (id: string) => {
    // Check if company is used in any budget
    const isUsed = budgets.some(
      (b) =>
        b.empresa_base_id === id || b.empresas_selecionadas_ids.includes(id)
    );

    if (isUsed) {
      toast.error(
        "Esta empresa não pode ser excluída pois está sendo usada em um ou mais orçamentos"
      );
      return;
    }

    const updatedCompanies = companies.filter((c) => c.id !== id);
    setCompanies(updatedCompanies);
    saveToLocalStorage("companies", updatedCompanies);
    
    toast.success("Empresa excluída com sucesso");
  };

  const addBudget = (
    budget: Omit<Budget, "id" | "data_criacao" | "empresas_selecionadas_ids"> & {
      empresas_selecionadas_ids: string[];
    }
  ): string => {
    const id = uuidv4();
    const newBudget: Budget = {
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

    // Update the state and save to localStorage synchronously
    const updatedBudgets = [...budgets, newBudget];
    setBudgets(updatedBudgets);
    saveToLocalStorage("budgets", updatedBudgets);
    
    toast.success("Orçamento criado com sucesso");
    return id;
  };

  const updateBudget = (budget: Budget) => {
    // Remove any alternative budgets for this budget as they'll need to be regenerated
    const filteredAltBudgets = alternativeBudgets.filter((ab) => ab.orcamento_id !== budget.id);
    setAlternativeBudgets(filteredAltBudgets);
    saveToLocalStorage("alternativeBudgets", filteredAltBudgets);

    // Update budgets and save synchronously
    const updatedBudgets = budgets.map((b) => (b.id === budget.id ? budget : b));
    setBudgets(updatedBudgets);
    saveToLocalStorage("budgets", updatedBudgets);
    
    toast.success("Orçamento atualizado com sucesso");
    return budget;
  };

  const deleteBudget = (id: string) => {
    const updatedBudgets = budgets.filter((b) => b.id !== id);
    setBudgets(updatedBudgets);
    saveToLocalStorage("budgets", updatedBudgets);
    
    // Delete all alternative budgets for this budget
    const updatedAltBudgets = alternativeBudgets.filter((ab) => ab.orcamento_id !== id);
    setAlternativeBudgets(updatedAltBudgets);
    saveToLocalStorage("alternativeBudgets", updatedAltBudgets);
    
    toast.success("Orçamento excluído com sucesso");
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
    console.log("Generating alternative budgets for budget ID:", budgetId);
    
    // Make sure we're working with the latest data from state
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) {
      console.error("Budget not found with ID:", budgetId);
      toast.error("Orçamento não encontrado");
      return [];
    }

    // First company is the base
    const baseCompanyId = budget.empresa_base_id;
    console.log("Base company ID:", baseCompanyId);
    const otherCompanyIds = budget.empresas_selecionadas_ids.filter(
      (id) => id !== baseCompanyId
    );
    console.log("Other company IDs:", otherCompanyIds);

    // Clear any existing alternative budgets for this budget
    const filteredBudgets = alternativeBudgets.filter((ab) => ab.orcamento_id !== budgetId);
    
    // Generate new alternative budgets
    const newAlternativeBudgetIds: string[] = [];
    const newAlternativeBudgets: AlternativeBudget[] = [];

    otherCompanyIds.forEach((companyId) => {
      const altBudgetId = uuidv4();
      newAlternativeBudgetIds.push(altBudgetId);

      // Create alternative items with different prices for each company
      const alternativeItems: BudgetItem[] = budget.itens.map((item) => {
        // Each company gets a different random percentage between 5% and 20%
        const increasePercentage = 5 + Math.random() * 15;
        const increaseFactor = 1 + increasePercentage / 100;
        
        return {
          ...item,
          id: uuidv4(), // Generate a new ID for each item
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
      console.log("Created alternative budget:", newAltBudget);
    });

    // Update state with all new alternative budgets at once
    const updatedAlternativeBudgets = [...filteredBudgets, ...newAlternativeBudgets];
    setAlternativeBudgets(updatedAlternativeBudgets);
    
    // Save to localStorage immediately to prevent data loss
    const saved = saveToLocalStorage("alternativeBudgets", updatedAlternativeBudgets);
    
    if (saved && newAlternativeBudgetIds.length > 0) {
      toast.success(`${otherCompanyIds.length} orçamentos alternativos gerados`);
    } else if (saved) {
      toast.info("Nenhuma empresa adicional selecionada para gerar orçamentos alternativos");
    }
    
    return newAlternativeBudgetIds;
  };

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
