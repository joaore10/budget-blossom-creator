
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Budget, Company, AlternativeBudget } from "@/types";
import { pdfUtils } from "./pdf-templates";

export const generatePDF = async (
  budget: Budget,
  company: Company,
  alternativeBudget?: AlternativeBudget
) => {
  try {
    // Use alternative items if available, otherwise use base items
    const items = alternativeBudget 
      ? alternativeBudget.itens_com_valores_alterados
      : budget.itens;

    // Generate HTML with replaced placeholders
    const filledHtml = pdfUtils.replacePlaceholders(
      company.modelo_pdf,
      company.nome,
      company.cnpj,
      company.representante,
      company.endereco,
      budget.cliente,
      items,
      budget.data_criacao
    );

    // Create temporary div
    const div = document.createElement("div");
    div.innerHTML = filledHtml;
    div.style.position = "fixed";
    div.style.left = "-9999px";
    document.body.appendChild(div);

    // Generate PDF
    try {
      const canvas = await html2canvas(div);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      // Generate filename based on client and company
      const fileName = `orcamento_${budget.cliente.replace(/\s+/g, "_")}_${company.nome.replace(/\s+/g, "_")}.pdf`;
      pdf.save(fileName);

      return true;
    } catch (err) {
      console.error("Error generating PDF:", err);
      return false;
    } finally {
      // Clean up DOM
      if (div.parentNode) {
        div.parentNode.removeChild(div);
      }
    }
  } catch (error) {
    console.error("Error in PDF generation:", error);
    return false;
  }
};
