
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
        {{#if LOGO_EMPRESA}}
        <img src="{{LOGO_EMPRESA}}" class="company-logo" alt="Logo da empresa" />
        {{/if}}
      </div>
      
      <div class="client-details">
        <h3>Dados do Cliente</h3>
        <p><strong>Nome:</strong> {{NOME_CLIENTE}}</p>
        <p><strong>Empresa:</strong> {{NOME_EMPRESA}}</p>
        {{#if RAZAO_SOCIAL}}
        <p><strong>Razão Social:</strong> {{RAZAO_SOCIAL}}</p>
        {{/if}}
        {{#if EMAIL_EMPRESA}}
        <p><strong>Email:</strong> {{EMAIL_EMPRESA}}</p>
        {{/if}}
        {{#if TELEFONE_EMPRESA}}
        <p><strong>Telefone:</strong> {{TELEFONE_EMPRESA}}</p>
        {{/if}}
      </div>

      <!-- Tabela de itens tradicional -->
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
      
      <!-- Exemplo de tabela com layout customizado -->
      <h3>Detalhamento alternativo (exemplo)</h3>
      <div id="custom-items"></div>
      
      <script>
        // Usando a variável ITENS_CUSTOM para personalizar o layout dos itens
        try {
          const items = {{ITENS_CUSTOM}};
          let html = '<table><tr><th>Descrição</th><th>Unidade</th><th>Qtd</th><th>Preço</th></tr>';
          items.forEach(item => {
            html += \`<tr>
              <td>\${item.descricao}</td>
              <td>\${item.unidade || 'UNIDADE'}</td>
              <td>\${item.quantidade}</td>
              <td>R$ \${item.valor_unitario.toFixed(2).replace('.', ',')}</td>
            </tr>\`;
          });
          html += '</table>';
          document.getElementById('custom-items').innerHTML = html;
        } catch (e) {
          document.getElementById('custom-items').innerHTML = '<p>Erro ao processar itens customizados</p>';
        }
      </script>

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
