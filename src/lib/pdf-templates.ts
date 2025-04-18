
export const defaultPdfTemplate = {
  html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Orçamento</title>
  <style>
    body {
      font-family: 'Helvetica', Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .company-info {
      margin-bottom: 30px;
    }
    .client-info {
      margin-bottom: 30px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      font-size: 14px;
    }
    .total {
      font-weight: bold;
      font-size: 18px;
      text-align: right;
      margin-top: 20px;
    }
    .signature {
      margin-top: 100px;
      border-top: 1px solid #333;
      width: 60%;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      padding-top: 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>ORÇAMENTO</h1>
    <p>Data: {{DATA}}</p>
  </div>
  
  <div class="company-info">
    <h2>{{NOME_EMPRESA}}</h2>
    <p>CNPJ: {{CNPJ_EMPRESA}}</p>
    <p>Representante: {{REPRESENTANTE}}</p>
    <p>Endereço: {{ENDERECO_EMPRESA}}</p>
  </div>
  
  <div class="client-info">
    <h3>Cliente</h3>
    <p>{{NOME_CLIENTE}}</p>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Descrição</th>
        <th>Quantidade</th>
        <th>Valor Unitário</th>
        <th>Valor Total</th>
      </tr>
    </thead>
    <tbody>
      {{ITENS}}
    </tbody>
  </table>
  
  <div class="total">
    TOTAL: R$ {{VALOR_TOTAL}}
  </div>
  
  <div class="signature">
    {{REPRESENTANTE}}
  </div>
  
  <div class="footer">
    <p>Este orçamento é válido por 30 dias a partir da data de emissão.</p>
  </div>
</body>
</html>
  `
};

export const pdfUtils = {
  replacePlaceholders: (
    template: string,
    companyName: string,
    companyCnpj: string,
    companyRepresentative: string,
    companyAddress: string,
    clientName: string,
    items: Array<{ descricao: string; quantidade: number; valor_unitario: number }>,
    date: string
  ) => {
    const formattedDate = new Date(date).toLocaleDateString('pt-BR');
    let totalValue = 0;
    
    // Generate items HTML
    let itemsHtml = '';
    items.forEach(item => {
      const itemTotal = item.quantidade * item.valor_unitario;
      totalValue += itemTotal;
      
      itemsHtml += `
      <tr>
        <td>${item.descricao}</td>
        <td>${item.quantidade}</td>
        <td>R$ ${item.valor_unitario.toFixed(2)}</td>
        <td>R$ ${itemTotal.toFixed(2)}</td>
      </tr>
      `;
    });
    
    // Replace placeholders
    return template
      .replace(/{{NOME_EMPRESA}}/g, companyName)
      .replace(/{{CNPJ_EMPRESA}}/g, companyCnpj)
      .replace(/{{REPRESENTANTE}}/g, companyRepresentative)
      .replace(/{{ENDERECO_EMPRESA}}/g, companyAddress)
      .replace(/{{NOME_CLIENTE}}/g, clientName)
      .replace(/{{ITENS}}/g, itemsHtml)
      .replace(/{{VALOR_TOTAL}}/g, totalValue.toFixed(2))
      .replace(/{{DATA}}/g, formattedDate);
  }
};
