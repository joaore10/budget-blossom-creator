
export const pdfUtils = {
  replacePlaceholders: (
    template: string,
    companyName: string,
    companyCnpj: string,
    companyRepresentative: string,
    companyAddress: string,
    clientName: string,
    items: Array<{ descricao: string; quantidade: number; valor_unitario: number }>,
    date: string
  ) => {
    const formattedDate = new Date(date).toLocaleDateString('pt-BR');
    let totalValue = 0;
    let numero = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    // Generate items HTML
    let itemsHtml = '';
    items.forEach((item) => {
      const itemTotal = item.quantidade * item.valor_unitario;
      totalValue += itemTotal;
      
      itemsHtml += `
      <tr>
        <td>${item.quantidade}</td>
        <td>UNIDADE</td>
        <td>${item.descricao}</td>
        <td>R$ ${item.valor_unitario.toFixed(2)}</td>
        <td>R$ ${itemTotal.toFixed(2)}</td>
      </tr>
      `;
    });
    
    // Replace placeholders
    return template
      .replace(/{{NOME_EMPRESA}}/g, companyName)
      .replace(/{{CNPJ_EMPRESA}}/g, companyCnpj)
      .replace(/{{REPRESENTANTE}}/g, companyRepresentative)
      .replace(/{{ENDERECO_EMPRESA}}/g, companyAddress || '')
      .replace(/{{NOME_CLIENTE}}/g, clientName)
      .replace(/{{ITENS}}/g, itemsHtml)
      .replace(/{{VALOR_TOTAL}}/g, totalValue.toFixed(2))
      .replace(/{{DATA}}/g, formattedDate)
      .replace(/{{NUMERO}}/g, numero)
      .replace(/{{CIDADE}}/g, companyAddress?.split(',').pop()?.trim() || '');
  }
};
