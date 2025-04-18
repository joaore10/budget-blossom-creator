
import { commonStyles } from '../pdf-styles';

export const template1 = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Orçamento</title>
  <style>
    ${commonStyles}
    .header {
      background: url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80') center;
      background-size: cover;
      color: white;
      padding: 40px;
      border-radius: 10px;
      margin-bottom: 30px;
      position: relative;
    }
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      border-radius: 10px;
    }
    .header h2, .header p {
      position: relative;
      z-index: 1;
    }
    .client-info {
      background: #F8F9FA;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border-left: 4px solid #8B5CF6;
    }
    .total {
      font-size: 24px;
      color: #8B5CF6;
      text-align: right;
      margin: 20px 0;
      padding: 20px;
      background: #F8F9FA;
      border-radius: 8px;
    }
    .signature {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #E5DEFF;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h2>ORÇAMENTO Nº {{NUMERO}}</h2>
    <p>{{DATA}}</p>
  </div>
  
  <div class="client-info">
    <p><strong>A/C:</strong> {{NOME_CLIENTE}}</p>
    <p>Prezado cliente, enviamos nossa proposta comercial referente ao orçamento solicitado.</p>
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

  <div class="total">
    <strong>Valor Total:</strong> R$ {{VALOR_TOTAL}}
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
`;
