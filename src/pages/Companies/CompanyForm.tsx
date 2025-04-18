
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { pdfTemplates, defaultPdfTemplate } from "@/lib/pdf-templates";
import { toast } from "sonner";

const CompanyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { companies, addCompany, updateCompany, getCompanyById } = useData();

  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    representante: "",
    endereco: "",
    modelo_pdf: defaultPdfTemplate.html,
  });

  const [selectedTemplate, setSelectedTemplate] = useState("template1");

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const company = getCompanyById(id);
      if (company) {
        setFormData({
          nome: company.nome,
          cnpj: company.cnpj,
          representante: company.representante,
          endereco: company.endereco,
          modelo_pdf: company.modelo_pdf,
        });
        
        // Find which template matches the stored HTML
        // This logic isn't working correctly because we're storing HTML strings
        // Let's improve this to identify templates by comparing the stored HTML
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
      // This was storing the template object itself, we need to store the HTML string
      modelo_pdf: pdfTemplates[templateKey as keyof typeof pdfTemplates]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
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

  const resetToDefaultTemplate = () => {
    setFormData((prev) => ({
      ...prev,
      modelo_pdf: defaultPdfTemplate.html,
    }));
    toast.success("Modelo de PDF restaurado para o padrão");
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

        <form onSubmit={handleSubmit}>
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>
                Preencha os campos abaixo com as informações da empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Empresa *</Label>
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

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="modelo_pdf">Modelo de PDF HTML</Label>
                  <div className="flex gap-2">
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
                </div>
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
