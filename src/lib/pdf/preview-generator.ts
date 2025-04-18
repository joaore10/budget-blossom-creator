
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

    // Ensure the company's modelo_pdf is used, falling back to template1 if not found
    const templateHtml = company.modelo_pdf && Object.values(pdfTemplates).includes(company.modelo_pdf)
      ? company.modelo_pdf
      : pdfTemplates.template1;

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
