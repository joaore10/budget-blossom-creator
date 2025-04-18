
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
      color: #1A1F2C;
      line-height: 1.6;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      padding: 20px;
      background: #F6F6F7;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .company-info {
      flex: 1;
    }
    .company-info h2 {
      color: #403E43;
      margin: 0 0 10px 0;
      font-size: 24px;
    }
    .company-info p {
      margin: 5px 0;
      color: #8A898C;
      font-size: 14px;
    }
    .document-info {
      text-align: right;
      padding: 10px 20px;
      background: #fff;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .document-info h1 {
      color: #1EAEDB;
      margin: 0;
      font-size: 28px;
    }
    .document-info p {
      margin: 5px 0;
      color: #8A898C;
    }
    .client-info {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #E5DEFF;
      margin-bottom: 30px;
    }
    .client-info h3 {
      color: #403E43;
      margin: 0 0 10px 0;
    }
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin: 20px 0;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    th {
      background: #8B5CF6;
      color: white;
      font-weight: 600;
      text-align: left;
      padding: 15px;
      font-size: 14px;
    }
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #F1F0FB;
      color: #403E43;
      font-size: 14px;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:hover td {
      background: #F6F6F7;
    }
    .total {
      text-align: right;
      margin: 30px 0;
      padding: 20px;
      background: #F6F6F7;
      border-radius: 8px;
      font-size: 18px;
      color: #403E43;
    }
    .total strong {
      color: #8B5CF6;
      font-size: 22px;
      margin-left: 10px;
    }
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #E5DEFF;
    }
    .signature {
      text-align: center;
      color: #8A898C;
    }
    .signature p {
      margin: 5px 0;
    }
    .conditions {
      margin-top: 30px;
      padding: 20px;
      background: #F6F6F7;
      border-radius: 8px;
      font-size: 12px;
      color: #8A898C;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <h2>{{NOME_EMPRESA}}</h2>
      <p>CNPJ: {{CNPJ_EMPRESA}}</p>
      <p>{{ENDERECO_EMPRESA}}</p>
    </div>
    <div class="document-info">
      <h1>ORÇAMENTO</h1>
      <p>Nº {{NUMERO}}</p>
      <p>Data: {{DATA}}</p>
    </div>
  </div>
  
  <div class="client-info">
    <h3>DADOS DO CLIENTE</h3>
    <p>{{NOME_CLIENTE}}</p>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Quantidade</th>
        <th>Unidade</th>
        <th>Descrição</th>
        <th>Valor Unit.</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {{ITENS}}
    </tbody>
  </table>
  
  <div class="total">
    Valor Total do Orçamento:<strong>R$ {{VALOR_TOTAL}}</strong>
  </div>
  
  <div class="footer">
    <div class="signature">
      <p>{{CIDADE}}, {{DATA}}</p>
      <p>_______________________________________________</p>
      <p>{{NOME_EMPRESA}}</p>
      <p>CNPJ: {{CNPJ_EMPRESA}}</p>
      <p>{{REPRESENTANTE}}</p>
    </div>
    
    <div class="conditions">
      <p>* Este orçamento tem validade de 15 dias.</p>
      <p>* Os valores apresentados podem sofrer alterações sem aviso prévio.</p>
      <p>* Prazo de entrega a combinar após aprovação do orçamento.</p>
    </div>
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
      background-color: #fff;
      color: #1A1F2C;
    }
    .header {
      background: linear-gradient(135deg, #8B5CF6 0%, #6E59A5 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
      margin-bottom: 15px;
    }
    .header p {
      margin: 5px 0;
      opacity: 0.9;
      font-size: 14px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 30px 0;
    }
    .info-box {
      background: #F6F6F7;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #E5DEFF;
    }
    .info-box h3 {
      color: #8B5CF6;
      margin: 0 0 15px 0;
      font-size: 18px;
    }
    .info-box p {
      margin: 5px 0;
      color: #403E43;
    }
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin: 30px 0;
      border: 1px solid #E5DEFF;
      border-radius: 8px;
      overflow: hidden;
    }
    th {
      background: #7E69AB;
      color: white;
      padding: 15px;
      text-align: left;
      font-weight: 500;
    }
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #E5DEFF;
    }
    tr:nth-child(even) td {
      background: #F6F6F7;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .total-box {
      background: #8B5CF6;
      color: white;
      padding: 20px 30px;
      border-radius: 8px;
      text-align: right;
      margin: 30px 0;
      box-shadow: 0 4px 6px rgba(139,92,246,0.2);
    }
    .total-box p {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px dashed #E5DEFF;
      text-align: center;
    }
    .signature-line {
      margin: 20px 0;
      border-bottom: 2px solid #8B5CF6;
      width: 300px;
      display: inline-block;
    }
    .notes {
      background: #F6F6F7;
      padding: 20px;
      border-radius: 8px;
      margin-top: 30px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{NOME_EMPRESA}}</h1>
    <p>CNPJ: {{CNPJ_EMPRESA}}</p>
    <p>{{ENDERECO_EMPRESA}}</p>
  </div>

  <div class="info-grid">
    <div class="info-box">
      <h3>ORÇAMENTO</h3>
      <p><strong>Número:</strong> {{NUMERO}}</p>
      <p><strong>Data:</strong> {{DATA}}</p>
    </div>

    <div class="info-box">
      <h3>CLIENTE</h3>
      <p>{{NOME_CLIENTE}}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Quantidade</th>
        <th>Unidade</th>
        <th>Descrição</th>
        <th>Valor Unit.</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {{ITENS}}
    </tbody>
  </table>

  <div class="total-box">
    <p>Total: R$ {{VALOR_TOTAL}}</p>
  </div>

  <div class="footer">
    <p>{{CIDADE}}, {{DATA}}</p>
    <div class="signature-line"></div>
    <p>{{REPRESENTANTE}}</p>
    <p>{{NOME_EMPRESA}}</p>
    <p>{{CNPJ_EMPRESA}}</p>

    <div class="notes">
      <p>• Orçamento válido por 15 dias</p>
      <p>• Formas de pagamento a combinar</p>
      <p>• Prazo de entrega: conforme negociação após aprovação</p>
    </div>
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
      background: #fff;
      color: #1A1F2C;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      padding: 30px;
      border-bottom: 3px solid #8B5CF6;
      margin-bottom: 40px;
    }
    .header h1 {
      color: #8B5CF6;
      font-size: 36px;
      margin: 0;
      margin-bottom: 15px;
    }
    .company-details {
      color: #666;
      font-size: 14px;
      line-height: 1.6;
    }
    .document-details {
      background: #F6F6F7;
      border-left: 4px solid #8B5CF6;
      padding: 20px;
      margin: 30px 0;
    }
    .document-details .number {
      font-size: 24px;
      color: #8B5CF6;
      margin-bottom: 10px;
    }
    .client-section {
      background: #fff;
      border: 1px solid #E5DEFF;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .client-section h2 {
      color: #8B5CF6;
      margin: 0 0 15px 0;
      font-size: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
      background: white;
      box-shadow: 0 0 20px rgba(0,0,0,0.05);
    }
    th {
      background: #7E69AB;
      color: white;
      padding: 15px;
      text-align: left;
      font-size: 14px;
    }
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #eee;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .total-section {
      background: #8B5CF6;
      color: white;
      padding: 20px 30px;
      border-radius: 8px;
      text-align: right;
      font-size: 24px;
      margin: 30px 0;
      box-shadow: 0 4px 6px rgba(139,92,246,0.2);
    }
    .signature-section {
      margin-top: 60px;
      text-align: center;
    }
    .signature-line {
      width: 60%;
      margin: 20px auto;
      border-bottom: 2px solid #8B5CF6;
    }
    .terms {
      margin-top: 40px;
      padding: 20px;
      background: #F6F6F7;
      border-radius: 8px;
      font-size: 12px;
      color: #666;
    }
    .terms ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
    .terms li {
      margin-bottom: 8px;
      padding-left: 15px;
      position: relative;
    }
    .terms li:before {
      content: "•";
      color: #8B5CF6;
      position: absolute;
      left: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{{NOME_EMPRESA}}</h1>
      <div class="company-details">
        <p>CNPJ: {{CNPJ_EMPRESA}}</p>
        <p>{{ENDERECO_EMPRESA}}</p>
      </div>
    </div>

    <div class="document-details">
      <div class="number">Orçamento Nº {{NUMERO}}</div>
      <p>Data de Emissão: {{DATA}}</p>
    </div>

    <div class="client-section">
      <h2>Informações do Cliente</h2>
      <p>{{NOME_CLIENTE}}</p>
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

    <div class="total-section">
      Valor Total: R$ {{VALOR_TOTAL}}
    </div>

    <div class="signature-section">
      <p>{{CIDADE}}, {{DATA}}</p>
      <div class="signature-line"></div>
      <p>{{REPRESENTANTE}}</p>
      <p>{{NOME_EMPRESA}}</p>
      <p>{{CNPJ_EMPRESA}}</p>
    </div>

    <div class="terms">
      <ul>
        <li>Orçamento válido por 15 dias a partir da data de emissão</li>
        <li>Valores sujeitos a alteração sem aviso prévio</li>
        <li>Prazo de entrega a ser definido após aprovação do orçamento</li>
        <li>Forma de pagamento a combinar</li>
      </ul>
    </div>
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
