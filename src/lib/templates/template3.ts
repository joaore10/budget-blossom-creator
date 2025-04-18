
import { commonStyles } from '../pdf-styles';

export const template3 = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Orçamento</title>
  <style>
    ${commonStyles}
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
    .header h2 {
      margin: 0;
      font-size: 28px;
      color: white;
      border: none;
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
`;

