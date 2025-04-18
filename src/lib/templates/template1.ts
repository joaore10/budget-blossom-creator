
import { commonStyles } from '../pdf-styles';

export const template1 = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Orçamento</title>
  <style>
    ${commonStyles}
    .client-info {
      background: #F8F9FA;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .client-info p {
      margin: 5px 0;
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
`;

