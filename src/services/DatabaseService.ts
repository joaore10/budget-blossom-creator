
import { Company, Budget, AlternativeBudget, BudgetItem } from '@/types';

// Interface para facilitar o gerenciamento das stores do IndexedDB
interface DBStores {
  companies: Company[];
  budgets: Budget[];
  alternativeBudgets: AlternativeBudget[];
}

class DatabaseService {
  private dbName = 'orcamentosDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  // Inicializa o banco de dados
  async initDB(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        console.error('Erro ao abrir o banco de dados:', event);
        reject(new Error('Não foi possível abrir o banco de dados'));
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Cria as stores se não existirem
        if (!db.objectStoreNames.contains('companies')) {
          db.createObjectStore('companies', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('budgets')) {
          db.createObjectStore('budgets', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('alternativeBudgets')) {
          db.createObjectStore('alternativeBudgets', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };
    });
  }

  // Método genérico para acessar uma transaction
  private async getStore<K extends keyof DBStores>(
    storeName: K,
    mode: IDBTransactionMode = 'readonly'
  ): Promise<IDBObjectStore> {
    await this.initDB();
    if (!this.db) throw new Error('Banco de dados não inicializado');
    
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  // CRUD para Empresas
  async getAllCompanies(): Promise<Company[]> {
    const store = await this.getStore('companies');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Erro ao buscar empresas'));
    });
  }

  async getCompanyById(id: string): Promise<Company | undefined> {
    const store = await this.getStore('companies');
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || undefined);
      request.onerror = () => reject(new Error(`Erro ao buscar empresa ${id}`));
    });
  }

  async createCompany(company: Omit<Company, "id"> & { modelo_pdf?: string }): Promise<string> {
    const id = crypto.randomUUID();
    const newCompany: Company = {
      ...company,
      id,
      modelo_pdf: company.modelo_pdf || "",
    };
    
    const store = await this.getStore('companies', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add(newCompany);
      
      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(new Error('Erro ao criar empresa'));
    });
  }

  async updateCompany(company: Company): Promise<void> {
    const store = await this.getStore('companies', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(company);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Erro ao atualizar empresa ${company.id}`));
    });
  }

  async deleteCompany(id: string): Promise<void> {
    const store = await this.getStore('companies', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Erro ao excluir empresa ${id}`));
    });
  }

  // CRUD para Orçamentos
  async getAllBudgets(): Promise<Budget[]> {
    const store = await this.getStore('budgets');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Erro ao buscar orçamentos'));
    });
  }

  async getBudgetById(id: string): Promise<Budget | undefined> {
    const store = await this.getStore('budgets');
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || undefined);
      request.onerror = () => reject(new Error(`Erro ao buscar orçamento ${id}`));
    });
  }

  async createBudget(budget: Omit<Budget, "id" | "data_criacao">): Promise<string> {
    const id = crypto.randomUUID();
    const newBudget: Budget = {
      ...budget,
      id,
      data_criacao: new Date().toISOString(),
    };
    
    const store = await this.getStore('budgets', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add(newBudget);
      
      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(new Error('Erro ao criar orçamento'));
    });
  }

  async updateBudget(budget: Budget): Promise<void> {
    const store = await this.getStore('budgets', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(budget);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Erro ao atualizar orçamento ${budget.id}`));
    });
  }

  async deleteBudget(id: string): Promise<void> {
    // Transação para excluir o orçamento e seus orçamentos alternativos
    await this.initDB();
    if (!this.db) throw new Error('Banco de dados não inicializado');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['budgets', 'alternativeBudgets'], 'readwrite');
      const budgetStore = transaction.objectStore('budgets');
      const altBudgetStore = transaction.objectStore('alternativeBudgets');
      
      // Primeiro, busca todos os orçamentos alternativos para excluir
      const getAltBudgets = this.getAlternativeBudgets(id);
      
      getAltBudgets.then(altBudgets => {
        // Exclui cada orçamento alternativo
        altBudgets.forEach(altBudget => {
          altBudgetStore.delete(altBudget.id);
        });
        
        // Então exclui o orçamento principal
        const deleteRequest = budgetStore.delete(id);
        
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(new Error(`Erro ao excluir orçamento ${id}`));
      }).catch(error => {
        reject(error);
      });
    });
  }

  // CRUD para Orçamentos Alternativos
  async getAlternativeBudgets(budgetId: string): Promise<AlternativeBudget[]> {
    const store = await this.getStore('alternativeBudgets');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => {
        const allAltBudgets = request.result as AlternativeBudget[];
        const filteredBudgets = allAltBudgets.filter(
          budget => budget.orcamento_id === budgetId
        );
        resolve(filteredBudgets);
      };
      
      request.onerror = () => reject(new Error(`Erro ao buscar orçamentos alternativos para ${budgetId}`));
    });
  }

  async createAlternativeBudget(altBudget: Omit<AlternativeBudget, "id">): Promise<string> {
    const id = crypto.randomUUID();
    const newAltBudget: AlternativeBudget = {
      ...altBudget,
      id,
    };
    
    const store = await this.getStore('alternativeBudgets', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add(newAltBudget);
      
      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(new Error('Erro ao criar orçamento alternativo'));
    });
  }
}

export const dbService = new DatabaseService();
