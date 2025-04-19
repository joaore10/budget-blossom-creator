
import { Budget, Company, AlternativeBudget } from "@/types";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { generatePreviewHTML } from "./preview-generator";

// Function to handle PDF generation and optional download
export const generatePDF = async (
  budget: Budget,
  company: Company,
  alternativeBudget?: AlternativeBudget,
  shouldDownload: boolean = false
): Promise<boolean> => {
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
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Convert canvas to PDF
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 297;
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
      
      // Only save/download if requested
      if (shouldDownload) {
        pdf.save(fileName);
      }
      
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
