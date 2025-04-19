
export const pdfUtils = {
  replacePlaceholders: (
    template: string,
    companyName: string,
    companyCnpj: string,
    companyRepresentative: string,
    companyAddress: string,
    clientName: string,
    items: Array<{ descricao: string; quantidade: number; valor_unitario: number; unidade: string }>,
    date: string,
    companyData?: {
      razao_social?: string;
      telefone?: string;
      email?: string;
      logo?: string;
    }
  ) => {
    const formattedDate = new Date(date).toLocaleDateString('pt-BR');
    let totalValue = 0;
    let numero = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    // Generate standard items HTML
    let itemsHtml = '';
    items.forEach((item, index) => {
      const itemTotal = item.quantidade * item.valor_unitario;
      totalValue += itemTotal;
      
      itemsHtml += `
      <tr>
        <td>${item.quantidade}</td>
        <td>${item.unidade || 'UNIDADE'}</td>
        <td>${item.descricao}</td>
        <td>R$ ${item.valor_unitario.toFixed(2).replace('.', ',')}</td>
        <td>R$ ${itemTotal.toFixed(2).replace('.', ',')}</td>
      </tr>
      `;
    });

    // Extract city from address if available
    const cityMatch = companyAddress?.match(/,\s*([^,]+)$/);
    const city = cityMatch ? cityMatch[1].trim() : '';
    
    // Create a JSON string of items for custom rendering
    const itemsJson = JSON.stringify(items);
    
    // Replace placeholders
    return template
      .replace(/{{NOME_EMPRESA}}/g, companyName)
      .replace(/{{RAZAO_SOCIAL}}/g, companyData?.razao_social || companyName)
      .replace(/{{CNPJ_EMPRESA}}/g, companyCnpj)
      .replace(/{{REPRESENTANTE}}/g, companyRepresentative)
      .replace(/{{ENDERECO_EMPRESA}}/g, companyAddress || '')
      .replace(/{{EMAIL_EMPRESA}}/g, companyData?.email || '')
      .replace(/{{TELEFONE_EMPRESA}}/g, companyData?.telefone || '')
      .replace(/{{LOGO_EMPRESA}}/g, companyData?.logo || '')
      .replace(/{{NOME_CLIENTE}}/g, clientName)
      .replace(/{{ITENS}}/g, itemsHtml)
      .replace(/{{ITENS_CUSTOM}}/g, itemsJson)
      .replace(/{{VALOR_TOTAL}}/g, totalValue.toFixed(2).replace('.', ','))
      .replace(/{{DATA}}/g, formattedDate)
      .replace(/{{NUMERO}}/g, numero)
      .replace(/{{CIDADE}}/g, city || companyAddress?.split(',').pop()?.trim() || '');
  }
};
