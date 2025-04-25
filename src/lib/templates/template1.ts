
import { commonStyles } from '../pdf-styles';

export const template1 = `
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orçamento {{NUMERO}}</title>
  <style>
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      padding: 10px 10px;
      border:  1px solid #000;
      font-size: 14px;
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    /* .header-logo {
      width: 100px;
      height: auto;
      margin-right: 10px;
    } */

    .header-right {
      text-align: right;
      font-size: 14px;
    }

    .header-title {
      font-size: 16px;
      font-weight: bold;
      margin: 10px 0;
      border-bottom: 1px solid #000;
      padding-bottom: 5px;
      text-align: left;
    }

    .header-date {
      font-size: 12px;
      margin-top: 5px;
    }

    /* Introduction */
    .introduction {
      font-size: 12px;
      margin: 10px 0 20px;
    }

    /* Client Info */
    .client-info {
      margin-bottom: 20px;
      font-size: 12px;
      
    }

    .client-info h3 {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;      
    }

    .client-info .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      border-top: 1px solid #000;
    }

    .client-info p {
      margin: 2px 0;
    }

    /* Table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 11px;
    }

    th,
    td {
      padding: 8px;
      text-align: center;
      border: 1px solid #ccc;
    }

    th {
      background: #e0e0e0;
      font-weight: bold;
    }

    td {
      background: #fff;
    }

    .table-image {
      width: 50px;
      height: auto;
      display: block;
      margin: 0 auto;
    }

    /* Column widths */
    th:nth-child(1),
    td:nth-child(1) {
      width: 5%;
      text-align: center;
    }

    /* Item */
    th:nth-child(2),
    td:nth-child(2) {
      width: 5%;
      text-align: center;
    }

    /* Nome */
    th:nth-child(3),
    td:nth-child(3) {
      width: 30%;
      text-align: center;
    }

    /* Imagem */
    th:nth-child(4),
    td:nth-child(4) {
      width: 10%;
      text-align: center;
    }

    /* Und. */
    th:nth-child(5),
    td:nth-child(5) {
      width: 10%;
      text-align: center;
    }

    /* Qtd. */
    th:nth-child(6),
    td:nth-child(6) {
      width: 10%;
      text-align: center;
    }

    /* Vr. Unit. */
    th:nth-child(7),
    td:nth-child(7) {
      width: 10%;
      text-align: center;
    }

    /* Subtotal */

    /* Total */
    .total {
      text-align: right;
      font-size: 12px;
      margin: 10px 0;
    }

    .total p {
      margin: 5px 0;
    }

    .total strong {
      font-weight: bold;
    }

    /* Observations */
    .observations {
      font-size: 10px;
      margin: 10px 0;
    }

    /* Signature */
    .signature {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
    }

    .signature-line {
      width: 200px;
      border-top: 1px solid #000;
      margin: 10px auto;
    }

    /* Print styles */
    @media print {
      @page {
        size: A4;
        margin: 10mm;
      }

      body {
        padding: 0;
        margin: 0;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .pdf-container {
        box-shadow: none;
        width: 100%;
        padding: 0;
      }

      table,
      .header,
      .client-info,
      .total,
      .signature {
        page-break-inside: avoid;
      }
    }

    /* Responsive adjustments */
    @media screen and (max-width: 768px) {
      .pdf-container {
        width: 100%;
        padding: 10px;
      }

      .header {
        flex-direction: column;
        text-align: center;
      }

      .header-right {
        text-align: center;
        margin-top: 10px;
      }

      .client-info .info-grid {
        grid-template-columns: 1fr;
      }

      table {
        font-size: 10px;
      }
    }
  </style>
</head>

<body>
  <div class="pdf-container">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <!-- <img src="" alt="DFabri Logo" class="header-logo"> -->
        <div class="company-info">
          <p><strong>{{NOME_EMPRESA}}</strong></p>
          <p>CNPJ: {{CNPJ_EMPRESA}}</p>
          <p>{{ENDERECO_EMPRESA}}</p>
        </div>
      </div>
      <div class="header-right">
        <p>Vendedor: {{REPRESENTANTE}}</p>
      </div>
    </div>
    <div class="header-title">
      ORÇAMENTO N° {{NUMERO}}
      <div class="header-date">{{DATA}}</div>
    </div>

    <!-- Introduction -->
    <div class="introduction">
      <p>Prezado cliente, segue nossa proposta comercial. Qualquer dúvida estamos à disposição.</p>
    </div>

    <!-- Client Info -->
    <div class="client-info">
      <h3>DADOS DO CLIENTE</h3>
      <div class="info-grid">
        <div>
          <p><strong>Cliente:</strong> {{NOME_CLIENTE}}</p>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <table id="tabela-itens">
      <thead>
        <tr>
          <th>Quantidade</th>
          <th>Unidade</th>
          <th>Item</th>
          <th>Observação</th>
          <th>Valor Unitário</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {{ITENS}}
      </tbody>
    </table>


    <!-- Total -->
    <div class="total">
      <p><strong>TOTAL: R$ {{VALOR_TOTAL}}</strong></p>
    </div>

    <!-- Signature -->
    <div class="signature">
      <p>Assinatura do cliente</p>
      <div class="signature-line"></div>
    </div>
  </div>
</body>

</html>
`;
