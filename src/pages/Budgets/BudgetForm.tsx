
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Save, FileText } from "lucide-react";
import { BudgetItem } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { generatePDF } from "@/lib/pdf-generator";

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
          itens: budget.itens.map((item) => ({ ...item })),
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
            return { ...item, [field]: parseFloat(value as string) || 0 };
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
      let budgetId = '';
      
      if (isEditing && id) {
        const existingBudget = getBudgetById(id);
        if (!existingBudget) {
          toast.error("Orçamento não encontrado");
          return;
        }

        const updatedBudget = updateBudget({
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
        
        // Gera os orçamentos alternativos imediatamente após atualização
        if (formData.empresas_selecionadas_ids.length > 1) {
          try {
            toast.info("Gerando orçamentos alternativos...");
            generateAlternativeBudgets(budgetId);
          } catch (error) {
            console.error("Error generating alternative budgets:", error);
            toast.error("Erro ao gerar orçamentos alternativos");
          }
        }
      } else {
        // Cria novo orçamento
        budgetId = addBudget({
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
        
        // Gera os orçamentos alternativos imediatamente após criação
        if (formData.empresas_selecionadas_ids.length > 1) {
          try {
            toast.info("Gerando orçamentos alternativos...");
            generateAlternativeBudgets(budgetId);
          } catch (error) {
            console.error("Error generating alternative budgets:", error);
            toast.error("Erro ao gerar orçamentos alternativos");
          }
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/orcamentos")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {isEditing ? "Editar Orçamento" : "Novo Orçamento"}
            </h1>
            <p className="text-gray-500">
              {isEditing
                ? "Atualize os dados do orçamento"
                : "Crie um novo orçamento no sistema"}
            </p>
          </div>
          {isEditing && (
            <Button variant="outline" onClick={handleGeneratePDF}>
              <FileText className="mr-2 h-4 w-4" />
              Gerar PDF
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Dados Gerais</CardTitle>
                <CardDescription>
                  Informações básicas do orçamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente *</Label>
                  <Input
                    id="cliente"
                    name="cliente"
                    value={formData.cliente}
                    onChange={handleChange}
                    placeholder="Nome do cliente"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="empresa_base_id">Empresa Base *</Label>
                  <Select
                    value={formData.empresa_base_id}
                    onValueChange={handleBaseCompanyChange}
                  >
                    <SelectTrigger>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    A empresa base define os preços originais do orçamento
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Empresas Adicionais</Label>
                  <div className="border rounded-md p-3 space-y-2">
                    {companies.map((company) => (
                      <div key={company.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`company-${company.id}`}
                          checked={formData.empresas_selecionadas_ids.includes(
                            company.id
                          )}
                          onCheckedChange={(checked) =>
                            handleCompanyCheckChange(company.id, checked === true)
                          }
                          disabled={company.id === formData.empresa_base_id}
                        />
                        <label
                          htmlFor={`company-${company.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {company.nome}
                          {company.id === formData.empresa_base_id && " (Base)"}
                        </label>
                      </div>
                    ))}
                    {companies.length <= 1 && (
                      <p className="text-xs text-muted-foreground">
                        Cadastre mais empresas para gerar orçamentos alternativos
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Selecione as empresas adicionais para gerar orçamentos alternativos
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Itens do Orçamento</CardTitle>
                <CardDescription>
                  Adicione os itens que compõem este orçamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.itens.length === 0 ? (
                  <div className="text-center py-6 border border-dashed rounded-md">
                    <p className="text-muted-foreground">
                      Nenhum item adicionado ainda
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={addItem}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Item
                    </Button>
                  </div>
                ) : (
                  formData.itens.map((item, index) => (
                    <div
                      key={item.id}
                      className="border rounded-md p-3 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Item {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`item-desc-${item.id}`}>
                          Descrição
                        </Label>
                        <Input
                          id={`item-desc-${item.id}`}
                          value={item.descricao}
                          onChange={(e) =>
                            updateItem(item.id, "descricao", e.target.value)
                          }
                          placeholder="Descreva o item"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor={`item-qty-${item.id}`}>
                            Quantidade
                          </Label>
                          <Input
                            id={`item-qty-${item.id}`}
                            type="number"
                            min="1"
                            value={item.quantidade}
                            onChange={(e) =>
                              updateItem(item.id, "quantidade", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`item-unit-${item.id}`}>
                            Valor Unitário
                          </Label>
                          <Input
                            id={`item-unit-${item.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.valor_unitario}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "valor_unitario",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        Total: {formatCurrency(calculateItemTotal(item))}
                      </div>
                    </div>
                  ))
                )}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addItem}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Item
                </Button>

                {formData.itens.length > 0 && (
                  <div className="mt-4 text-right font-bold text-lg">
                    Total do Orçamento:{" "}
                    {formatCurrency(calculateBudgetTotal())}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mt-6 space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/orcamentos")}
            >
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Salvar Orçamento
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default BudgetForm;
