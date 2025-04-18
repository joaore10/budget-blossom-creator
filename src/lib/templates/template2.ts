
import { commonStyles } from '../pdf-styles';

export const template2 = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Orçamento</title>
  <style>
    ${commonStyles}
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
      color: white;
      border: none;
    }
    .info-section {
      background: #F8FAFC;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
      border: 1px solid #E2E8F0;
    }
    .total-section {
      text-align: right;
      padding: 20px;
      background: #F8FAFC;
      border-radius: 8px;
      margin: 30px 0;
      border: 1px solid #E2E8F0;
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
`;

