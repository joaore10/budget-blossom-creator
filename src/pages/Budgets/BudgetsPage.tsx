import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  FileText,
  FilePlus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { generatePDF } from "@/lib/pdf-generator";

const BudgetsPage = () => {
  const { budgets, deleteBudget, getCompanyById, generateAlternativeBudgets } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBudgets, setFilteredBudgets] = useState(budgets);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    let sorted = [...budgets].sort((a, b) => {
      const dateA = new Date(a.data_criacao).getTime();
      const dateB = new Date(b.data_criacao).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    if (searchTerm) {
      sorted = sorted.filter(
        (budget) =>
          budget.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getCompanyById(budget.empresa_base_id)?.nome
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBudgets(sorted);
  }, [searchTerm, budgets, getCompanyById, sortOrder]);

  const handleDeleteClick = (budgetId: string) => {
    setBudgetToDelete(budgetId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (budgetToDelete) {
      deleteBudget(budgetToDelete);
      setDeleteConfirmOpen(false);
      setBudgetToDelete(null);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleGenerateAllPDFs = async (budget: typeof budgets[0]) => {
    const company = getCompanyById(budget.empresa_base_id);
    if (!company) {
      toast.error("Empresa base não encontrada");
      return;
    }

    toast.info("Gerando PDFs...");
    
    try {
      const alternativeBudgetIds = await generateAlternativeBudgets(budget.id);
      
      await generatePDF(budget, company);

      for (const altBudgetId of alternativeBudgetIds) {
        const altBudget = alternativeBudgets.find(ab => ab.id === altBudgetId);
        if (altBudget) {
          const altCompany = getCompanyById(altBudget.empresa_id);
          if (altCompany) {
            await generatePDF(budget, altCompany, altBudget);
          }
        }
      }

      toast.success("PDFs gerados com sucesso");
    } catch (error) {
      console.error("Error generating PDFs:", error);
      toast.error("Erro ao gerar PDFs");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getBudgetStatus = (creationDate: string) => {
    const creation = new Date(creationDate);
    const now = new Date();
    const expirationDate = new Date(creation);
    expirationDate.setDate(creation.getDate() + 30);

    const daysToExpiration = Math.ceil(
      (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysToExpiration <= 0) {
      return <Badge variant="destructive">Expirado</Badge>;
    } else if (daysToExpiration <= 7) {
      return <Badge variant="outline" className="bg-orange-400 hover:bg-orange-500">Expirando</Badge>;
    } else {
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Válido</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateTotal = (budget: typeof budgets[0]) => {
    return budget.itens.reduce(
      (sum, item) => sum + item.quantidade * item.valor_unitario,
      0
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Orçamentos</h1>
            <p className="text-gray-500">
              Gerencie os orçamentos criados no sistema
            </p>
          </div>
          <Button asChild>
            <Link to="/orcamentos/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo Orçamento
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista de Orçamentos</CardTitle>
            <CardDescription>
              Total de {filteredBudgets.length} orçamentos cadastrados
            </CardDescription>

            <div className="flex items-center gap-2 mt-2">
              <Search className="text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por cliente ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSortOrder}
                className="ml-auto"
              >
                Ordenar por data: {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Empresa Base</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBudgets.length > 0 ? (
                    filteredBudgets.map((budget) => (
                      <TableRow key={budget.id}>
                        <TableCell className="font-medium">
                          {budget.cliente}
                        </TableCell>
                        <TableCell>
                          {getCompanyById(budget.empresa_base_id)?.nome || "N/A"}
                        </TableCell>
                        <TableCell>{formatDate(budget.data_criacao)}</TableCell>
                        <TableCell>
                          {getBudgetStatus(budget.data_criacao)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(calculateTotal(budget))}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleGenerateAllPDFs(budget)}
                                >
                                  <FilePlus className="h-4 w-4 mr-2" />
                                  Gerar PDFs
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="h-8 w-8 p-0"
                            >
                              <Link to={`/orcamentos/editar/${budget.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleDeleteClick(budget.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        <div className="flex flex-col items-center justify-center text-sm">
                          <AlertTriangle className="h-10 w-10 text-gray-400 mb-2" />
                          {searchTerm ? (
                            <p>
                              Nenhum orçamento encontrado para{" "}
                              <strong>"{searchTerm}"</strong>
                            </p>
                          ) : (
                            <p>Nenhum orçamento cadastrado ainda</p>
                          )}
                          <Button variant="link" className="mt-2" asChild>
                            <Link to="/orcamentos/novo">
                              Criar novo orçamento
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Tem certeza que deseja excluir
              este orçamento?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default BudgetsPage;
