export interface Company {
  id: string;
  nome: string;
  cnpj: string;
  representante: string;
  endereco: string;
  modelo_pdf: string;
}

export interface BudgetItem {
  id: string;
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  observacao?: string;
}

export interface Budget {
  id: string;
  empresa_base_id: string;
  data_criacao: string;
  cliente: string;
  itens: BudgetItem[];
  empresas_selecionadas_ids: string[];
}

export interface AlternativeBudget {
  id: string;
  orcamento_id: string;
  empresa_id: string;
  itens_com_valores_alterados: BudgetItem[];
}

export interface DefaultPdfTemplate {
  html: string;
}
