import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pdfTemplates, defaultPdfTemplate } from "@/lib/pdf-templates";
import PdfPreview from "@/components/PdfPreview";
import { toast } from "sonner";

const CompanyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { companies, addCompany, updateCompany, getCompanyById } = useData();

  const [formData, setFormData] = useState({
    nome: "",
    razao_social: "",
    cnpj: "",
    telefone: "",
    email: "",
    logo: "",
    representante: "",
    endereco: "",
    modelo_pdf: defaultPdfTemplate.html,
  });

  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const company = getCompanyById(id);
      if (company) {
        setFormData({
          nome: company.nome,
          razao_social: company.razao_social || "",
          cnpj: company.cnpj,
          telefone: company.telefone || "",
          email: company.email || "",
          logo: company.logo || "",
          representante: company.representante,
          endereco: company.endereco,
          modelo_pdf: company.modelo_pdf || defaultPdfTemplate.html,
        });
        
        for (const [key, template] of Object.entries(pdfTemplates)) {
          if (company.modelo_pdf === template) {
            setSelectedTemplate(key);
            break;
          }
        }
      } else {
        toast.error("Empresa não encontrada");
        navigate("/empresas");
      }
    }
  }, [id, isEditing, getCompanyById, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    setFormData(prev => ({
      ...prev,
      modelo_pdf: pdfTemplates[templateKey as keyof typeof pdfTemplates]
    }));
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localPath = file.name;
      setFormData(prev => ({ ...prev, logo: localPath }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.cnpj || !formData.representante) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      if (isEditing && id) {
        updateCompany({
          id,
          ...formData,
        });
      } else {
        addCompany(formData);
      }
      navigate("/empresas");
    } catch (error) {
      console.error("Error saving company:", error);
      toast.error("Erro ao salvar empresa");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/empresas")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Editar Empresa" : "Nova Empresa"}
            </h1>
            <p className="text-gray-500">
              {isEditing
                ? "Atualize os dados da empresa"
                : "Cadastre uma nova empresa no sistema"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>
                Preencha os campos abaixo com as informações da empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Fantasia *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Ex: Empresa ABC Ltda."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="razao_social">Razão Social</Label>
                  <Input
                    id="razao_social"
                    name="razao_social"
                    value={formData.razao_social}
                    onChange={handleChange}
                    placeholder="Ex: Empresa ABC Limitada"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    placeholder="Ex: 12.345.678/0001-90"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="Ex: (11) 99999-9999"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ex: contato@empresa.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo da Empresa</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="flex-grow"
                    />
                    {(logoPreview || formData.logo) && (
                      <img 
                        src={logoPreview || formData.logo} 
                        alt="Logo Preview" 
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </div>
                  {formData.logo && !logoPreview && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Caminho do arquivo: {formData.logo}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="representante">Representante *</Label>
                  <Input
                    id="representante"
                    name="representante"
                    value={formData.representante}
                    onChange={handleChange}
                    placeholder="Ex: João da Silva"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Ex: Rua das Flores, 123 - Centro - São Paulo/SP"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modelo de PDF</CardTitle>
              <CardDescription>
                Selecione ou personalize o modelo de PDF para os orçamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="modelo_pdf">Template</Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Selecione um modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="template1">Modelo 1</SelectItem>
                    <SelectItem value="template2">Modelo 2</SelectItem>
                    <SelectItem value="template3">Modelo 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modelo_pdf">HTML do Modelo</Label>
                  <Textarea
                    id="modelo_pdf"
                    name="modelo_pdf"
                    value={formData.modelo_pdf}
                    onChange={handleChange}
                    placeholder="Template HTML para gerar PDF"
                    className="font-mono text-xs min-h-[300px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use marcadores como {'{{'} NOME_EMPRESA {'}}'},  {'{{'} CNPJ_EMPRESA {'}}'}, etc.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Preview do PDF</Label>
                  <PdfPreview 
                    html={formData.modelo_pdf} 
                    className="min-h-[300px] border"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/empresas")}
              >
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Layout>
  );
};

export default CompanyForm;
