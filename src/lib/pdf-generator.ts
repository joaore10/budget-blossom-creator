
import { Budget, Company, AlternativeBudget } from "@/types";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { pdfUtils } from "./pdf-utils";
import { pdfTemplates } from "./pdf-templates";

// Function to generate a preview HTML string without actually creating a PDF
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
    const filledHtml = pdfUtils.replacePlaceholders(
      templateHtml,
      company.nome,
      company.cnpj,
      company.representante,
      company.endereco,
      budget.cliente,
      items,
      budget.data_criacao
    );

    return filledHtml;
  } catch (error) {
    console.error("Error generating preview HTML:", error);
    return "<div>Error generating preview</div>";
  }
};

export const generatePDF = async (
  budget: Budget,
  company: Company,
  alternativeBudget?: AlternativeBudget
) => {
  try {
    const filledHtml = generatePreviewHTML(budget, company, alternativeBudget);
    
    // Create a temporary div to render the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = filledHtml;
    tempDiv.className = 'pdf-container';
    
    // Add print styles to the temporary div
    tempDiv.style.width = '210mm';
    tempDiv.style.padding = '10mm';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    
    document.body.appendChild(tempDiv);
    
    try {
      // Generate filename based on client and company
      const fileName = `orcamento_${budget.cliente.replace(/\s+/g, "_")}_${company.nome.replace(/\s+/g, "_")}.pdf`;
      
      // Create PDF with A4 size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        hotfixes: ['px_scaling']
      });
      
      // Render HTML to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Convert canvas to PDF
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save PDF
      pdf.save(fileName);
      
      return true;
    } finally {
      // Always remove the temporary div
      if (tempDiv && tempDiv.parentNode) {
        document.body.removeChild(tempDiv);
      }
    }
  } catch (error) {
    console.error("Error in PDF generation:", error);
    return false;
  }
};
