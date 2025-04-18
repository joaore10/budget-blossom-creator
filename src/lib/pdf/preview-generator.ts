
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

    // The issue is here: we're checking if the template exists in pdfTemplates
    // but we're storing the actual HTML in the company.modelo_pdf
    // So instead of checking if it's in the templates, we should use it directly
    
    // Original code that's causing the issue:
    // const templateHtml = company.modelo_pdf && Object.values(pdfTemplates).includes(company.modelo_pdf)
    //   ? company.modelo_pdf
    //   : pdfTemplates.template1;
    
    // Fixed code - use the company's template directly:
    const templateHtml = company.modelo_pdf || pdfTemplates.template1;

    // Generate HTML with replaced placeholders
    return pdfUtils.replacePlaceholders(
      templateHtml,
      company.nome,
      company.cnpj,
      company.representante,
      company.endereco,
      budget.cliente,
      items,
      budget.data_criacao
    );
  } catch (error) {
    console.error("Error generating preview HTML:", error);
    return "<div>Error generating preview</div>";
  }
};
