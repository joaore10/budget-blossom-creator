
import { Budget, Company, AlternativeBudget } from "@/types";
import { pdfTemplates } from "./templates";
import { pdfUtils } from "./utils/pdf-utils";

export const generatePreviewHTML = (
  budget: Budget,
  company: Company,
  alternativeBudget?: AlternativeBudget
): string => {
  try {
    // Use alternative items if available, otherwise use base items
    const items = alternativeBudget 
      ? alternativeBudget.itens_com_valores_alterados
      : budget.itens;

    // Agora vamos usar diretamente o modelo HTML da empresa, sem verificação
    // Se não houver um modelo definido, usamos o template padrão
    const templateHtml = company.modelo_pdf || pdfTemplates.template1;
    
    console.log("Usando modelo da empresa:", company.nome);
    console.log("Template utilizado:", templateHtml.substring(0, 100) + "...");

    // Generate HTML with replaced placeholders
    return pdfUtils.replacePlaceholders(
      templateHtml,
      company.nome,
      company.cnpj,
      company.representante,
      company.endereco,
      budget.cliente,
      items,
      budget.data_criacao,
      {
        razao_social: company.razao_social,
        telefone: company.telefone,
        email: company.email,
        logo: company.logo
      }
    );
  } catch (error) {
    console.error("Error generating preview HTML:", error);
    return "<div>Error generating preview</div>";
  }
};
