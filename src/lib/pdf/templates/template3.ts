
import { commonStyles } from '../../pdf-styles';

export const template3 = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Orçamento</title>
  <style>
    
    .container {
      padding: 20px;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 25px;
      background: #3d3f3f;
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
      border: 2px solid #3d3f3f;
      border-radius: 0 0 10px 10px;
    }
    table {
      box-shadow: none;
      border: 2px solid #3d3f3f;
      margin-top: 15px;
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 10px;
      padding-bottom: 20px;
      text-align: center;
    }
    th {
      background: #3d3f3f;
      color: white;
    }
    .total-value {
      background: #3d3f3f;
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
      border-top: 4px solid #3d3f3f;
      text-align: center;
      background: white;
      border-radius: 10px;
    }
    .company-logo {
      max-height: 100px;
      max-width: 200px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body class="pdf-content">
  <div class="container">
    <div class="header">
      <h2>ORÇAMENTO</h2>
      <div>
        <p>Nº {{NUMERO}}</p>
        <p>{{DATA}}</p>
      </div>
    </div>

    <div class="content">
      <div style="text-align: center; margin-bottom: 20px">
        <img src="{{LOGO_EMPRESA}}" class="company-logo" alt="Logo da empresa" />
      </div>
      
      <div class="client-details">
        <h3>Dados do Cliente</h3>
        <p><strong>Nome:</strong> {{NOME_CLIENTE}}</p>
      </div>
      <br>
      <div class="client-details">
        <h3>Dados da Empresa</h3>
        <p><strong>Empresa:</strong> {{NOME_EMPRESA}}</p>
        <p><strong>Razão Social:</strong> {{RAZAO_SOCIAL}}</p>
        <p><strong>Email:</strong> {{EMAIL_EMPRESA}}</p>
        <p><strong>Telefone:</strong> {{TELEFONE_EMPRESA}}</p>
      </div>

      <!-- Tabela de itens tradicional -->
      <table>
        <thead>
          <tr>
            <th>Qtd</th>
            <th>Unidade</th>
            <th>Descrição</th>
            <th>Obs</th>
            <th>Valor Un.</th>
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
