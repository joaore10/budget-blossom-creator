
import { dbService } from "@/services/DatabaseService";

const sampleCompanies = [
  {
    nome: "Empresa A Ltda",
    cnpj: "12.345.678/0001-90",
    representante: "João Silva",
    endereco: "Rua A, 123 - Centro - São Paulo/SP",
  },
  {
    nome: "Empresa B Ltda",
    cnpj: "98.765.432/0001-21",
    representante: "Maria Santos",
    endereco: "Avenida B, 456 - Vila Nova - Rio de Janeiro/RJ",
  },
  {
    nome: "Empresa C Ltda",
    cnpj: "45.678.901/0001-23",
    representante: "Pedro Oliveira",
    endereco: "Praça C, 789 - Jardim América - Belo Horizonte/MG",
  }
];

export async function seedInitialCompanies() {
  try {
    // Usamos o dbService em vez do supabase para compatibilidade local
    for (const company of sampleCompanies) {
      await dbService.createCompany(company);
    }
    console.log('Companies seeded successfully');
  } catch (error) {
    console.error('Error seeding companies:', error);
    throw error;
  }
}
