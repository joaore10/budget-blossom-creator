
export const commonStyles = `
  .pdf-content {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 40px;
    color: #333;
    line-height: 1.6;
  }
  .pdf-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 25px 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border-radius: 8px;
    overflow: hidden;
    table-layout: fixed;
    page-break-inside: avoid;
  }
  .pdf-content th {
    background: #8B5CF6;
    color: white;
    padding: 15px;
    text-align: left;
  }
  .pdf-content td {
    padding: 12px 15px;
    border-bottom: 1px solid #E5DEFF;
  }
  .pdf-content tr:last-child td {
    border-bottom: none;
  }
  .pdf-content tr {
    page-break-inside: avoid;
  }
  .pdf-content h2 {
    color: #8B5CF6;
    font-size: 28px;
    margin-bottom: 30px;
    border-bottom: 2px solid #E5DEFF;
    padding-bottom: 10px;
  }
  @media print {
    @page {
      size: A4;
      margin: 1cm;
    }
    .pdf-content {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
  .pdf-container {
    width: 210mm;
    min-height: 297mm;
    padding: 10mm;
    margin: 0 auto;
    background: white;
  }
`;
