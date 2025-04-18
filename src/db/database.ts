
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtém o caminho do diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configura o caminho do banco de dados
const dbPath = path.join(__dirname, '../../database.db');

// Cria/conecta ao banco de dados
export const db = new Database(dbPath, { verbose: console.log });

// Inicializa as tabelas
const initDb = () => {
  // Tabela de empresas
  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      cnpj TEXT NOT NULL,
      representante TEXT NOT NULL,
      endereco TEXT,
      modelo_pdf TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de orçamentos
  db.exec(`
    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      cliente TEXT NOT NULL,
      empresa_base_id TEXT NOT NULL,
      empresas_selecionadas_ids TEXT NOT NULL,
      itens TEXT NOT NULL,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (empresa_base_id) REFERENCES companies(id)
    )
  `);

  // Tabela de orçamentos alternativos
  db.exec(`
    CREATE TABLE IF NOT EXISTS alternative_budgets (
      id TEXT PRIMARY KEY,
      orcamento_id TEXT NOT NULL,
      empresa_id TEXT NOT NULL,
      itens_com_valores_alterados TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (orcamento_id) REFERENCES budgets(id),
      FOREIGN KEY (empresa_id) REFERENCES companies(id)
    )
  `);
};

// Inicializa o banco de dados
initDb();

// Prepara statements comuns
export const statements = {
  companies: {
    getAll: db.prepare('SELECT * FROM companies'),
    getById: db.prepare('SELECT * FROM companies WHERE id = ?'),
    insert: db.prepare(`
      INSERT INTO companies (id, nome, cnpj, representante, endereco, modelo_pdf)
      VALUES (?, ?, ?, ?, ?, ?)
    `),
    update: db.prepare(`
      UPDATE companies 
      SET nome = ?, cnpj = ?, representante = ?, endereco = ?, modelo_pdf = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `),
    delete: db.prepare('DELETE FROM companies WHERE id = ?')
  },
  budgets: {
    getAll: db.prepare('SELECT * FROM budgets'),
    getById: db.prepare('SELECT * FROM budgets WHERE id = ?'),
    insert: db.prepare(`
      INSERT INTO budgets (id, cliente, empresa_base_id, empresas_selecionadas_ids, itens)
      VALUES (?, ?, ?, ?, ?)
    `),
    update: db.prepare(`
      UPDATE budgets 
      SET cliente = ?, empresa_base_id = ?, empresas_selecionadas_ids = ?, itens = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `),
    delete: db.prepare('DELETE FROM budgets WHERE id = ?')
  },
  alternativeBudgets: {
    getAll: db.prepare('SELECT * FROM alternative_budgets'),
    getByBudgetId: db.prepare('SELECT * FROM alternative_budgets WHERE orcamento_id = ?'),
    insert: db.prepare(`
      INSERT INTO alternative_budgets (id, orcamento_id, empresa_id, itens_com_valores_alterados)
      VALUES (?, ?, ?, ?)
    `),
    delete: db.prepare('DELETE FROM alternative_budgets WHERE orcamento_id = ?')
  }
};
