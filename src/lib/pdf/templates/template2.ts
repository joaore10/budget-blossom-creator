
import { commonStyles } from '../../pdf-styles';

export const template2 = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Orçamento</title>
  <style>
    .header {
      background: #2C3E50;
      color: white;
      padding: 25px;
      border-radius: 0;
      margin-bottom: 30px;
    }
    .header-logo{
      img{
        margin: 0 auto;
        display: block;
        width: 80px;
      }
    }
    table {
      border: 2px solid #2C3E50;
      border-radius: 0;
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 10px;
      padding-bottom: 20px;
    }
    th {
      background: #2C3E50;
      color: white;
    }
    th,
    tr {
      text-align: center;
      
    }
    .info-section {
      background: #ECF0F1;
      padding: 20px;
      border-left: 4px solid #2C3E50;
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;

      .info-right{
        text-align: left;
      }

      .info-left{
        text-align: left;
      }
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
      display: flex;
      justify-content:space-between;
    }
  </style>
</head>
<body class="pdf-content">
  <div class="header">
    <div class="header-logo">
      <img src="{{LOGO_EMPRESA}}" alt="Logo" class="">
    </div>
    <h2>ORÇAMENTO Nº {{NUMERO}}</h2>
    <p>Data: {{DATA}}</p>
  </div>

  <div class="info-section">
    <div class="info-left">
      <p><strong>Empresa:</strong> {{NOME_EMPRESA}}</p>
      <p><strong>CNPJ:</strong> {{CNPJ_EMPRESA}}</p>
      <p><strong>Endereço:</strong> {{ENDERECO_EMPRESA}}</p>
    </div>
    <div class="info-right">
      <p><strong>Representante:</strong> {{REPRESENTANTE}}</p>
      <p><strong>Tel:</strong> {{TELEFONE_EMPRESA}}</p>
      <p><strong>Email:</strong> {{EMAIL_EMPRESA}}</p>
    </div>
  </div>

  <div class="info-section">
    <p><strong>Cliente:</strong> {{NOME_CLIENTE}}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Quantidade</th>
        <th>Tipo</th>
        <th>Item descrição</th>
        <th>Observação</th>
        <th>Preço Unitário</th>
        <th>Preço Total</th>
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
    <div>
      <p>{{CIDADE}}, {{DATA}}</p>
      <p>_______________________________________________</p>
      <p><strong>{{REPRESENTANTE}}</strong></p>
      <p>{{NOME_EMPRESA}}</p>
      <p>CNPJ: {{CNPJ_EMPRESA}}</p>
    </div>

    <div>
      <p>_______________, ______________</p>
      <p>_______________________________________________</p>
      <p><strong>{{CLIENTE}}</strong></p>
    </div>
    
  </div>
</body>
</html>
`;
