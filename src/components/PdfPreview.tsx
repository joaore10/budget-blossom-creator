
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface PdfPreviewProps {
  html: string;
  className?: string;
}

const PdfPreview = ({ html, className = '' }: PdfPreviewProps) => {
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    // Substituir placeholders com dados de exemplo
    const sampleData = {
      NOME_EMPRESA: 'Empresa Exemplo',
      CNPJ_EMPRESA: '00.000.000/0000-00',
      REPRESENTANTE: 'João da Silva',
      ENDERECO_EMPRESA: 'Rua Exemplo, 123',
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

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div 
        className="max-h-[600px] overflow-auto p-4 bg-white"
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
    </Card>
  );
};

export default PdfPreview;
