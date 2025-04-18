
// Define diferent HTML template options
export const pdfTemplates = {
  template1: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Orçamento</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
    }
    .header {
      border: 1px solid #ccc;
      padding: 10px;
      margin-bottom: 20px;
      border-radius: 5px;
    }
    .logo {
      max-width: 100px;
      margin-right: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .total {
      text-align: right;
      margin-top: 20px;
      font-weight: bold;
    }
    .signature {
      margin-top: 50px;
      border-top: 1px solid #000;
      padding-top: 10px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h2>{{NOME_EMPRESA}}</h2>
    <p>CNPJ: {{CNPJ_EMPRESA}}</p>
    <p>ENDEREÇO: {{ENDERECO_EMPRESA}}</p>
  </div>
  
  <h1>ORÇAMENTO {{NUMERO}}</h1>
  <p>Data: {{DATA}}</p>
  
  <div class="client-info">
    <h3>Cliente:</h3>
    <p>{{NOME_CLIENTE}}</p>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Quantidade</th>
        <th>Unidade</th>
        <th>Descrição</th>
        <th>Valor</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {{ITENS}}
    </tbody>
  </table>
  
  <div class="total">
    Valor total da proposta: R$ {{VALOR_TOTAL}}
  </div>
  
  <div class="signature">
    <p>{{CIDADE}}, {{DATA}}</p>
    <p>{{NOME_EMPRESA}}</p>
    <p>{{CNPJ_EMPRESA}}</p>
    <p>{{REPRESENTANTE}}</p>
  </div>
</body>
</html>
`,

  template2: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Orçamento</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f8f8f8;
    }
    .header {
      background-color: #003366;
      color: white;
      padding: 15px;
      margin-bottom: 20px;
    }
    .info {
      margin: 20px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background-color: white;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #003366;
      color: white;
    }
    .total {
      text-align: right;
      margin-top: 20px;
      font-size: 1.2em;
      font-weight: bold;
    }
    .observations {
      margin-top: 30px;
      border: 1px solid #ddd;
      padding: 15px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{NOME_EMPRESA}}</h1>
    <p>CNPJ: {{CNPJ_EMPRESA}}</p>
    <p>{{ENDERECO_EMPRESA}}</p>
  </div>

  <div class="info">
    <p><strong>Número:</strong> {{NUMERO}}</p>
    <p><strong>Data:</strong> {{DATA}}</p>
  </div>

  <div class="client-info">
    <h3>Cliente: {{NOME_CLIENTE}}</h3>
  </div>

  <table>
    <thead>
      <tr>
        <th>Quantidade</th>
        <th>Unidade</th>
        <th>Descrição</th>
        <th>Valor</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {{ITENS}}
    </tbody>
  </table>

  <div class="total">
    Total: R$ {{VALOR_TOTAL}}
  </div>

  <div class="observations">
    <p>{{CNPJ_EMPRESA}}</p>
    <p>{{REPRESENTANTE}}</p>
  </div>
</body>
</html>
`,

  template3: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Orçamento</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      max-width: 150px;
      margin-bottom: 20px;
    }
    .info-block {
      border: 1px solid #ccc;
      padding: 15px;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 10px;
      text-align: left;
    }
    th {
      background-color: #f0f0f0;
    }
    .total {
      text-align: right;
      margin-top: 20px;
      font-weight: bold;
      font-size: 1.2em;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{NOME_EMPRESA}}</h1>
    <p>{{ENDERECO_EMPRESA}}</p>
    <p>CNPJ: {{CNPJ_EMPRESA}}</p>
  </div>

  <div class="info-block">
    <h2>ORÇAMENTO Nº {{NUMERO}}</h2>
    <p>Data: {{DATA}}</p>
    <p><strong>Cliente:</strong> {{NOME_CLIENTE}}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Quantidade</th>
        <th>Descrição</th>
        <th>Valor Unitário</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {{ITENS}}
    </tbody>
  </table>

  <div class="total">
    Valor Total: R$ {{VALOR_TOTAL}}
  </div>

  <div class="info-block" style="margin-top: 30px;">
    <p style="text-align: center;">{{REPRESENTANTE}}</p>
  </div>
</body>
</html>
`
};

export const defaultPdfTemplate = {
  html: pdfTemplates.template1
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
    let numero = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    // Generate items HTML
    let itemsHtml = '';
    items.forEach((item, index) => {
      const itemTotal = item.quantidade * item.valor_unitario;
      totalValue += itemTotal;
      
      itemsHtml += `
      <tr>
        <td>${item.quantidade}</td>
        <td>UNIDADE</td>
        <td>${item.descricao}</td>
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
      .replace(/{{ENDERECO_EMPRESA}}/g, companyAddress || '')
      .replace(/{{NOME_CLIENTE}}/g, clientName)
      .replace(/{{ITENS}}/g, itemsHtml)
      .replace(/{{VALOR_TOTAL}}/g, totalValue.toFixed(2))
      .replace(/{{DATA}}/g, formattedDate)
      .replace(/{{NUMERO}}/g, numero)
      .replace(/{{CIDADE}}/g, companyAddress?.split(',').pop()?.trim() || '');
  }
};
