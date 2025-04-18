
import { supabase } from "@/integrations/supabase/client";
import { Company, Budget, AlternativeBudget } from "@/types";

const sampleCompanies: Omit<Company, "id">[] = [
  {
    nome: "Empresa A Ltda",
    cnpj: "12.345.678/0001-90",
    representante: "João Silva",
    endereco: "Rua A, 123 - Centro - São Paulo/SP",
    modelo_pdf: ""
  },
  {
    nome: "Empresa B Ltda",
    cnpj: "98.765.432/0001-21",
    representante: "Maria Santos",
    endereco: "Avenida B, 456 - Vila Nova - Rio de Janeiro/RJ",
    modelo_pdf: ""
  },
  {
    nome: "Empresa C Ltda",
    cnpj: "45.678.901/0001-23",
    representante: "Pedro Oliveira",
    endereco: "Praça C, 789 - Jardim América - Belo Horizonte/MG",
    modelo_pdf: ""
  }
];

export async function seedInitialData() {
  try {
    // Seed Companies
    const { data: companiesData, error: companiesError } = await supabase
      .from('companies')
      .upsert(sampleCompanies, { 
        onConflict: 'cnpj',
        returning: 'minimal'
      });

    if (companiesError) throw companiesError;

    console.log('Companies seeded successfully');

  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

// Função para executar seed na inicialização do app
export async function runInitialSeed() {
  try {
    // Verifica se já existem empresas
    const { count } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });

    if (count === 0) {
      await seedInitialData();
    }
  } catch (error) {
    console.error('Initial seed check failed:', error);
  }
}
