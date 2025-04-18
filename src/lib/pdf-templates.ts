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
      padding: 40px;
      color: #333;
      line-height: 1.6;
    }
    h2 {
      color: #8B5CF6;
      font-size: 28px;
      margin-bottom: 30px;
      border-bottom: 2px solid #E5DEFF;
      padding-bottom: 10px;
    }
    .client-info {
      background: #F8F9FA;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .client-info p {
      margin: 5px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    th {
      background: #8B5CF6;
      color: white;
      padding: 15px;
      text-align: left;
    }
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #E5DEFF;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .total {
      font-size: 20px;
      color: #8B5CF6;
      text-align: right;
      margin: 20px 0;
      padding: 15px;
      background: #F8F9FA;
      border-radius: 8px;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      color: #666;
    }
    .signature {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #E5DEFF;
      text-align: center;
    }
  </style>
</head>
<body>
  <h2>ORÇAMENTO Nº {{NUMERO}}</h2>
  
  <div class="client-info">
    <p><strong>A/C:</strong> {{NOME_CLIENTE}}</p>
    <p>Prezado cliente, enviamos nossa proposta comercial referente ao orçamento solicitado.</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Quantidade</th>
        <th>Unidade</th>
        <th>Valor Unitário</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {{ITENS}}
    </tbody>
  </table>

  <div class="total">
    <strong>Valor Total da Proposta:</strong> R$ {{VALOR_TOTAL}}
  </div>

  <div class="signature">
    <p>{{CIDADE}}, {{DATA}}</p>
    <p>_______________________________________________</p>
    <p><strong>{{REPRESENTANTE}}</strong></p>
    <p>{{NOME_EMPRESA}}</p>
    <p>CNPJ: {{CNPJ_EMPRESA}}</p>
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
      padding: 40px;
      color: #2D3748;
      line-height: 1.6;
    }
    .header {
      background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);
      color: white;
      padding: 25px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .header h2 {
      margin: 0;
      font-size: 24px;
    }
    .header p {
      margin: 5px 0 0 0;
      opacity: 0.9;
    }
    .info-section {
      background: #F8FAFC;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
      border: 1px solid #E2E8F0;
    }
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin: 25px 0;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    th {
      background: #7C3AED;
      color: white;
      padding: 15px;
      font-weight: 500;
      text-align: left;
    }
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #E2E8F0;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .total-section {
      text-align: right;
      padding: 20px;
      background: #F8FAFC;
      border-radius: 8px;
      margin: 30px 0;
      border: 1px solid #E2E8F0;
    }
    .total-section strong {
      font-size: 20px;
      color: #7C3AED;
    }
    .observations {
      background: #F8FAFC;
      padding: 20px;
      border-radius: 8px;
      margin: 30px 0;
      font-size: 14px;
      color: #4A5568;
      border: 1px solid #E2E8F0;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px dashed #E2E8F0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h2>ORÇAMENTO Nº {{NUMERO}}</h2>
    <p>Data: {{DATA}}</p>
  </div>

  <div class="info-section">
    <p><strong>Cliente:</strong> {{NOME_CLIENTE}}</p>
    <p><strong>Empresa:</strong> {{NOME_EMPRESA}}</p>
    <p><strong>CNPJ:</strong> {{CNPJ_EMPRESA}}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Quantidade</th>
        <th>Unidade</th>
        <th>Descrição</th>
        <th>Valor Unitário</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {{ITENS}}
    </tbody>
  </table>

  <div class="total-section">
    <strong>Valor Total: R$ {{VALOR_TOTAL}}</strong>
  </div>

  <div class="observations">
    <p><strong>Observações:</strong></p>
    <ul>
      <li>Este orçamento tem validade de 15 dias a partir da data de emissão.</li>
      <li>Valores sujeitos a alteração sem aviso prévio.</li>
      <li>Prazo de entrega a combinar após aprovação do orçamento.</li>
    </ul>
  </div>

  <div class="footer">
    <p>{{CIDADE}}, {{DATA}}</p>
    <p>_______________________________________________</p>
    <p><strong>{{REPRESENTANTE}}</strong></p>
    <p>{{NOME_EMPRESA}}</p>
    <p>CNPJ: {{CNPJ_EMPRESA}}</p>
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
      padding: 40px;
      color: #1A1F2C;
      line-height: 1.6;
      background: #FFFFFF;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 25px;
      background: #8B5CF6;
      color: white;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .header-left h2 {
      margin: 0;
      font-size: 28px;
    }
    .header-right {
      text-align: right;
    }
    .header-right p {
      margin: 5px 0;
    }
    .client-details {
      background: #F6F6F7;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border: 1px solid #E5DEFF;
    }
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin: 25px 0;
      background: white;
      border: 1px solid #E5DEFF;
      border-radius: 8px;
      overflow: hidden;
    }
    th {
      background: #7C3AED;
      color: white;
      padding: 15px;
      text-align: left;
      font-size: 14px;
    }
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #E5DEFF;
    }
    tr:nth-child(even) {
      background: #F8F9FA;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .total-section {
      display: flex;
      justify-content: flex-end;
      padding: 20px;
      background: #7C3AED;
      color: white;
      border-radius: 8px;
      margin: 30px 0;
      font-size: 20px;
    }
    .validity {
      background: #F6F6F7;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      font-size: 14px;
      color: #666;
      text-align: center;
    }
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #E5DEFF;
      text-align: center;
    }
    .signature-area {
      margin: 20px 0;
    }
    .signature-line {
      width: 300px;
      margin: 10px auto;
      border-bottom: 2px solid #8B5CF6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <h2>ORÇAMENTO</h2>
      </div>
      <div class="header-right">
        <p>Nº {{NUMERO}}</p>
        <p>{{DATA}}</p>
      </div>
    </div>

    <div class="client-details">
      <h3>Dados do Cliente</h3>
      <p><strong>Nome:</strong> {{NOME_CLIENTE}}</p>
      <p><strong>Empresa:</strong> {{NOME_EMPRESA}}</p>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Descrição</th>
          <th>Quantidade</th>
          <th>Valor Unitário</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {{ITENS}}
      </tbody>
    </table>

    <div class="total-section">
      <span>Valor Total: R$ {{VALOR_TOTAL}}</span>
    </div>

    <div class="validity">
      Este orçamento é válido por 15 dias corridos a partir da data de emissão.
    </div>

    <div class="footer">
      <p>{{CIDADE}}, {{DATA}}</p>
      <div class="signature-area">
        <div class="signature-line"></div>
        <p><strong>{{REPRESENTANTE}}</strong></p>
        <p>{{NOME_EMPRESA}}</p>
        <p>CNPJ: {{CNPJ_EMPRESA}}</p>
      </div>
    </div>
  </div>
</body>
</html>
`,
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
