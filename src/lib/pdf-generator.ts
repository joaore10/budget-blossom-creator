
import { Budget, Company, AlternativeBudget } from "@/types";
import puppeteer from 'puppeteer';
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

    // Get the template based on company's modelo_pdf or use default template
    const templateHtml = company.modelo_pdf && company.modelo_pdf in pdfTemplates
      ? pdfTemplates[company.modelo_pdf as keyof typeof pdfTemplates]
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
    
    // Add CSS for print optimization
    const htmlWithPrintStyles = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          table {
            table-layout: fixed;
            width: 100%;
            page-break-inside: avoid;
          }
          tr {
            page-break-inside: avoid;
          }
          @media print {
            html, body {
              width: 210mm;
              height: 297mm;
            }
          }
        </style>
      </head>
      <body>
        ${filledHtml}
      </body>
      </html>
    `;
    
    // Launch puppeteer browser - fixed headless option to use true instead of "new"
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      
      // Set content and wait for rendering
      await page.setContent(htmlWithPrintStyles, { 
        waitUntil: 'networkidle0' 
      });
      
      // Generate filename based on client and company
      const fileName = `orcamento_${budget.cliente.replace(/\s+/g, "_")}_${company.nome.replace(/\s+/g, "_")}.pdf`;
      
      // Generate PDF with high quality settings
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: '1cm',
          right: '1cm',
          bottom: '1cm',
          left: '1cm'
        }
      });
      
      // Convert buffer to blob and download
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } finally {
      // Always close the browser
      await browser.close();
    }
  } catch (error) {
    console.error("Error in PDF generation:", error);
    return false;
  }
};
