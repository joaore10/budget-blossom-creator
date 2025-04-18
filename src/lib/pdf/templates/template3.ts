
import { commonStyles } from '../../pdf-styles';

export const template3 = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Orçamento</title>
  <style>
    ${commonStyles}
    .container {
      background: url('https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=800&q=80') no-repeat bottom right;
      background-size: 300px;
      padding: 20px;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 25px;
      background: #FF6B6B;
      color: white;
      border-radius: 10px 10px 0 0;
      margin-bottom: 0;
    }
    .header h2 {
      margin: 0;
      color: white;
      border: none;
    }
    .content {
      background: white;
      padding: 30px;
      border: 2px solid #FF6B6B;
      border-radius: 0 0 10px 10px;
    }
    table {
      box-shadow: none;
      border: 2px solid #FF6B6B;
    }
    th {
      background: #FF6B6B;
    }
    .total-value {
      background: #FF6B6B;
      color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: right;
      font-size: 24px;
      margin: 30px 0;
    }
    .footer {
      margin-top: 50px;
      padding: 30px;
      border-top: 4px solid #FF6B6B;
      text-align: center;
      background: white;
      border-radius: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>ORÇAMENTO</h2>
      <div>
        <p>Nº {{NUMERO}}</p>
        <p>{{DATA}}</p>
      </div>
    </div>

    <div class="content">
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

      <div class="total-value">
        <strong>Valor Total:</strong> R$ {{VALOR_TOTAL}}
      </div>

      <div class="footer">
        <p>{{CIDADE}}, {{DATA}}</p>
        <div class="signature-area">
          <p>_______________________________________________</p>
          <p><strong>{{REPRESENTANTE}}</strong></p>
          <p>{{NOME_EMPRESA}}</p>
          <p>CNPJ: {{CNPJ_EMPRESA}}</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;
