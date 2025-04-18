
import { commonStyles } from '../../pdf-styles';

export const template2 = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Orçamento</title>
  <style>
    ${commonStyles}
    body {
      background: url('https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&w=800&q=80') no-repeat top right;
      background-size: 200px;
      padding-top: 220px;
    }
    .header {
      background: #2C3E50;
      color: white;
      padding: 25px;
      border-radius: 0;
      margin-bottom: 30px;
      position: relative;
    }
    table {
      border: 2px solid #2C3E50;
      border-radius: 0;
    }
    th {
      background: #2C3E50;
      color: white;
    }
    .info-section {
      background: #ECF0F1;
      padding: 20px;
      border-left: 4px solid #2C3E50;
      margin-bottom: 25px;
    }
    .total-section {
      text-align: right;
      padding: 20px;
      background: #2C3E50;
      color: white;
      margin: 30px 0;
    }
    .footer {
      border-top: 4px solid #2C3E50;
      margin-top: 50px;
      padding-top: 20px;
      text-align: center;
    }
  </style>
</head>
<body class="pdf-content">
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
        <th>Item</th>
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
    <strong>Valor Total:</strong> R$ {{VALOR_TOTAL}}
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
`;
