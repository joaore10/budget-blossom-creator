
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

interface PdfPreviewProps {
  html: string;
  className?: string;
}

const PdfPreview = ({ html, className = '' }: PdfPreviewProps) => {
  const [previewHtml, setPreviewHtml] = useState('');
  const [showVariables, setShowVariables] = useState(false);

  useEffect(() => {
    // Substituir placeholders com dados de exemplo
    const sampleData = {
      NOME_EMPRESA: 'Empresa Exemplo',
      CNPJ_EMPRESA: '00.000.000/0000-00',
      REPRESENTANTE: 'João da Silva',
      ENDERECO_EMPRESA: 'Rua Exemplo, 123, São Paulo, SP',
      NOME_CLIENTE: 'Cliente Exemplo',
      CIDADE: 'São Paulo',
      DATA: new Date().toLocaleDateString('pt-BR'),
      NUMERO: '000001',
      VALOR_TOTAL: '1.000,00',
      ITENS: `
        <tr>
          <td>1</td>
          <td>UNIDADE</td>
          <td>Item de exemplo</td>
          <td>R$ 500,00</td>
          <td>R$ 500,00</td>
        </tr>
        <tr>
          <td>2</td>
          <td>UNIDADE</td>
          <td>Outro item de exemplo</td>
          <td>R$ 250,00</td>
          <td>R$ 500,00</td>
        </tr>
      `
    };

    let preview = html;
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      preview = preview.replace(regex, value);
    });

    setPreviewHtml(preview);
  }, [html]);

  const availableVariables = [
    { name: 'NOME_EMPRESA', description: 'Nome fantasia da empresa' },
    { name: 'RAZAO_SOCIAL', description: 'Razão social da empresa' },
    { name: 'CNPJ_EMPRESA', description: 'CNPJ da empresa' },
    { name: 'REPRESENTANTE', description: 'Nome do representante da empresa' },
    { name: 'ENDERECO_EMPRESA', description: 'Endereço completo da empresa' },
    { name: 'EMAIL_EMPRESA', description: 'Email da empresa' },
    { name: 'TELEFONE_EMPRESA', description: 'Telefone da empresa' },
    { name: 'LOGO_EMPRESA', description: 'URL da logo da empresa (use em tags <img>)' },
    { name: 'NOME_CLIENTE', description: 'Nome do cliente' },
    { name: 'CIDADE', description: 'Cidade extraída do endereço da empresa' },
    { name: 'DATA', description: 'Data de criação do orçamento' },
    { name: 'NUMERO', description: 'Número do orçamento (gerado automaticamente)' },
    { name: 'VALOR_TOTAL', description: 'Valor total do orçamento' },
    { name: 'ITENS', description: 'Tabela de itens do orçamento (formato HTML)' },
    { name: 'ITENS_CUSTOM', description: 'Permite acesso aos itens individuais para personalização (use em loop JS)' }
  ];

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => setShowVariables(!showVariables)}
          className="p-2 text-sm text-blue-600 hover:text-blue-800 underline self-end mr-4 mt-2"
        >
          {showVariables ? 'Ocultar' : 'Mostrar'} variáveis disponíveis
        </button>
        
        {showVariables && (
          <Alert className="mx-4 mb-2">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Variáveis disponíveis para templates</AlertTitle>
            <AlertDescription>
              <div className="text-sm mt-2 max-h-[200px] overflow-y-auto">
                <p className="mb-2">Utilize estas variáveis no formato <code>{'{{NOME_VARIAVEL}}'}</code> no seu template HTML:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {availableVariables.map((variable) => (
                    <li key={variable.name}>
                      <code className="bg-gray-100 px-1 rounded">{'{{' + variable.name + '}}'}</code> - {variable.description}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs">
                  <strong>Nota:</strong> Para personalizar completamente o formato dos itens, você pode usar JavaScript em seu template:
                </p>
                <pre className="bg-gray-100 p-2 rounded text-xs mt-1 overflow-x-auto">
                  {`<script>
  const items = {{ITENS_CUSTOM}};
  let html = '<table><tr><th>Nome</th><th>Qtd</th></tr>';
  items.forEach(item => {
    html += \`<tr><td>\${item.descricao}</td><td>\${item.quantidade}</td></tr>\`;
  });
  html += '</table>';
  document.getElementById('custom-items').innerHTML = html;
</script>
<div id="custom-items"></div>`}
                </pre>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div 
          className="max-h-[600px] overflow-auto p-4 bg-white"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
    </Card>
  );
};

export default PdfPreview;
