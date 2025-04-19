import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { BudgetItem } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { generatePDF } from "@/lib/pdf/document-generator";

const unidadeOptions = [
  "UNIDADE",
  "PACOTE",
  "CAIXA",
  "METRO",
  "METRO²",
  "METRO³",
  "LITRO",
  "HORA",
  "DIÁRIA",
  "KG",
];

const BudgetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    companies,
    addBudget,
    updateBudget,
    getBudgetById,
    getCompanyById,
    generateAlternativeBudgets,
  } = useData();

  const [formData, setFormData] = useState({
    cliente: "",
    empresa_base_id: "",
    empresas_selecionadas_ids: [] as string[],
    itens: [] as BudgetItem[],
  });

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing && id) {
      const budget = getBudgetById(id);
      if (budget) {
        setFormData({
          cliente: budget.cliente,
          empresa_base_id: budget.empresa_base_id,
          empresas_selecionadas_ids: [...budget.empresas_selecionadas_ids],
          itens: budget.itens.map((item) => ({ 
            ...item, 
            unidade: item.unidade || "UNIDADE" 
          })),
        });
      } else {
        toast.error("Orçamento não encontrado");
        navigate("/orcamentos");
      }
    } else if (companies.length > 0) {
      setFormData((prev) => ({
        ...prev,
        empresa_base_id: companies[0].id,
        empresas_selecionadas_ids: [companies[0].id],
      }));
    }
  }, [id, isEditing, getBudgetById, navigate, companies]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBaseCompanyChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      empresa_base_id: value,
      empresas_selecionadas_ids: [
        value,
        ...prev.empresas_selecionadas_ids.filter((id) => id !== value),
      ],
    }));
  };

  const handleCompanyCheckChange = (companyId: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          empresas_selecionadas_ids: [
            ...prev.empresas_selecionadas_ids,
            companyId,
          ],
        };
      } else {
        if (companyId === prev.empresa_base_id) {
          return prev;
        }
        return {
          ...prev,
          empresas_selecionadas_ids: prev.empresas_selecionadas_ids.filter(
            (id) => id !== companyId
          ),
        };
      }
    });
  };

  const addItem = () => {
    const newItem: BudgetItem = {
      id: uuidv4(),
      descricao: "",
      quantidade: 1,
      valor_unitario: 0,
      observacao: "",
      unidade: "UNIDADE",
    };

    setFormData((prev) => ({
      ...prev,
      itens: [...prev.itens, newItem],
    }));
  };

  const updateItem = (
    itemId: string,
    field: keyof BudgetItem,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      itens: prev.itens.map((item) => {
        if (item.id === itemId) {
          if (field === "quantidade") {
            return { ...item, [field]: parseInt(value as string) || 0 };
          } else if (field === "valor_unitario") {
            const processedValue = (value as string).replace(",", ".");
            return { ...item, [field]: parseFloat(processedValue) || 0 };
          }
          return { ...item, [field]: value };
        }
        return item;
      }),
    }));
  };

  const removeItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      itens: prev.itens.filter((item) => item.id !== itemId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cliente || !formData.empresa_base_id) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (formData.itens.length === 0) {
      toast.error("Adicione pelo menos um item ao orçamento");
      return;
    }

    for (const item of formData.itens) {
      if (!item.descricao || item.quantidade <= 0 || item.valor_unitario <= 0) {
        toast.error("Preencha todos os campos dos itens corretamente");
        return;
      }
    }

    try {
      let budgetId: string;
      
      if (isEditing && id) {
        const existingBudget = getBudgetById(id);
        if (!existingBudget) {
          toast.error("Orçamento não encontrado");
          return;
        }

        await updateBudget({
          ...existingBudget,
          cliente: formData.cliente,
          empresa_base_id: formData.empresa_base_id,
          empresas_selecionadas_ids: [
            formData.empresa_base_id,
            ...formData.empresas_selecionadas_ids.filter(
              (compId) => compId !== formData.empresa_base_id
            ),
          ],
          itens: formData.itens,
        });
        
        budgetId = id;
      } else {
        budgetId = await addBudget({
          cliente: formData.cliente,
          empresa_base_id: formData.empresa_base_id,
          empresas_selecionadas_ids: [
            formData.empresa_base_id,
            ...formData.empresas_selecionadas_ids.filter(
              (compId) => compId !== formData.empresa_base_id
            ),
          ],
          itens: formData.itens,
        });
      }
      
      if (formData.empresas_selecionadas_ids.length > 1) {
        try {
          toast.info("Gerando orçamentos alternativos...");
          await generateAlternativeBudgets(budgetId);
        } catch (error) {
          console.error("Error generating alternative budgets:", error);
          toast.error("Erro ao gerar orçamentos alternativos");
        }
      }

      navigate("/orcamentos");
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error("Erro ao salvar orçamento");
    }
  };

  const calculateItemTotal = (item: BudgetItem) => {
    return item.quantidade * item.valor_unitario;
  };

  const calculateBudgetTotal = () => {
    return formData.itens.reduce(
      (sum, item) => sum + calculateItemTotal(item),
      0
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleGeneratePDF = async () => {
    if (isEditing && id) {
      const budget = getBudgetById(id);
      if (!budget) {
        toast.error("Orçamento não encontrado");
        return;
      }

      const baseCompany = getCompanyById(budget.empresa_base_id);
      if (!baseCompany) {
        toast.error("Empresa base não encontrada");
        return;
      }

      try {
        toast.info("Gerando PDF...");
        await generatePDF(budget, baseCompany);
        toast.success("PDF gerado com sucesso");
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast.error("Erro ao gerar PDF");
      }
    } else {
      toast.error("Salve o orçamento antes de gerar o PDF");
    }
  };

  const formatValorUnitario = (valor: number) => {
    return valor.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6 px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/orcamentos")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-medium text-gray-900">
              {isEditing ? "Editar Orçamento" : "Novo Orçamento"}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Input
                    id="cliente"
                    name="cliente"
                    value={formData.cliente}
                    onChange={handleChange}
                    placeholder="Nome do cliente"
                    className="bg-gray-50 border-0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="empresa_base_id">Empresa Base</Label>
                  <Select
                    value={formData.empresa_base_id}
                    onValueChange={handleBaseCompanyChange}
                  >
                    <SelectTrigger className="bg-gray-50 border-0">
                      <SelectValue placeholder="Selecione a empresa base" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Empresas Adicionais</Label>
                <Card className="border border-gray-100">
                  <CardContent className="grid gap-2 p-4 md:grid-cols-2">
                    {companies.map((company) => (
                      <div key={company.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`company-${company.id}`}
                          checked={formData.empresas_selecionadas_ids.includes(company.id)}
                          onCheckedChange={(checked) =>
                            handleCompanyCheckChange(company.id, checked === true)
                          }
                          disabled={company.id === formData.empresa_base_id}
                        />
                        <label
                          htmlFor={`company-${company.id}`}
                          className="text-sm text-gray-600"
                        >
                          {company.nome}
                          {company.id === formData.empresa_base_id && " (Base)"}
                        </label>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium">Itens do Orçamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.itens.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Nenhum item adicionado ainda</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addItem}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.itens.map((item, index) => (
                    <Card
                      key={item.id}
                      className="border border-gray-100 shadow-none"
                    >
                      <CardContent className="p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">
                            Item {index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 p-0 hover:bg-gray-100 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`item-desc-${item.id}`}>Descrição</Label>
                            <Input
                              id={`item-desc-${item.id}`}
                              value={item.descricao}
                              onChange={(e) =>
                                updateItem(item.id, "descricao", e.target.value)
                              }
                              placeholder="Nome do item"
                              className="bg-gray-50 border-0"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`item-obs-${item.id}`}>
                              Observações (opcional)
                            </Label>
                            <Textarea
                              id={`item-obs-${item.id}`}
                              value={item.observacao || ""}
                              onChange={(e) =>
                                updateItem(item.id, "observacao", e.target.value)
                              }
                              placeholder="Detalhes adicionais sobre o item"
                              className="bg-gray-50 border-0 resize-none"
                              rows={2}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`item-qty-${item.id}`}>Quantidade</Label>
                            <Input
                              id={`item-qty-${item.id}`}
                              type="number"
                              min="1"
                              value={item.quantidade}
                              onChange={(e) =>
                                updateItem(item.id, "quantidade", e.target.value)
                              }
                              className="bg-gray-50 border-0"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`item-unit-${item.id}`}>
                              Unidade
                            </Label>
                            <Select
                              value={item.unidade || "UNIDADE"}
                              onValueChange={(value) => updateItem(item.id, "unidade", value)}
                            >
                              <SelectTrigger id={`item-unit-type-${item.id}`} className="bg-gray-50 border-0">
                                <SelectValue placeholder="Selecione a unidade" />
                              </SelectTrigger>
                              <SelectContent>
                                {unidadeOptions.map((unidade) => (
                                  <SelectItem key={unidade} value={unidade}>
                                    {unidade}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`item-unit-price-${item.id}`}>
                              Valor Unitário
                            </Label>
                            <Input
                              id={`item-unit-price-${item.id}`}
                              type="text"
                              value={formatValorUnitario(item.valor_unitario)}
                              onChange={(e) =>
                                updateItem(item.id, "valor_unitario", e.target.value)
                              }
                              className="bg-gray-50 border-0"
                            />
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-900">
                            Total: {formatCurrency(calculateItemTotal(item))}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addItem}
                    className="w-full gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Item
                  </Button>

                  {formData.itens.length > 0 && (
                    <div className="text-right pt-4">
                      <span className="text-lg font-medium text-gray-900">
                        Total do Orçamento: {formatCurrency(calculateBudgetTotal())}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/orcamentos")}
              className="gap-2"
            >
              Cancelar
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Salvar Orçamento
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default BudgetForm;
