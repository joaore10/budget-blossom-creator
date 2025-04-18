
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { generatePDF } from "@/lib/pdf-generator";
import { Budget, Company, AlternativeBudget } from "@/types";
import BudgetHeader from "./components/BudgetHeader";
import BudgetSearch from "./components/BudgetSearch";
import BudgetTable from "./components/BudgetTable";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import AlternativeBudgetsDialog from "./components/AlternativeBudgetsDialog";

const BudgetsPage = () => {
  const {
    budgets,
    deleteBudget,
    getCompanyById,
    generateAlternativeBudgets,
    getAlternativeBudgetsByBudgetId
  } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBudgets, setFilteredBudgets] = useState(budgets);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedBudgetAlternatives, setSelectedBudgetAlternatives] = useState<string | null>(null);

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

  const handleGenerateAllPDFs = async (budget: Budget) => {
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
        const altBudget = getAlternativeBudgetsByBudgetId(budget.id).find(ab => ab.id === altBudgetId);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateTotal = (budget: Budget) => {
    return budget.itens.reduce(
      (sum, item) => sum + item.quantidade * item.valor_unitario,
      0
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <BudgetHeader />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista de Orçamentos</CardTitle>
            <CardDescription>
              Total de {filteredBudgets.length} orçamentos cadastrados
            </CardDescription>

            <BudgetSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortOrder={sortOrder}
              onSortToggle={toggleSortOrder}
            />
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
                  <BudgetTable
                    budgets={filteredBudgets}
                    getCompanyById={getCompanyById}
                    onDeleteClick={handleDeleteClick}
                    onGeneratePDFs={handleGenerateAllPDFs}
                    formatDate={formatDate}
                    formatCurrency={formatCurrency}
                    calculateTotal={calculateTotal}
                  />
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
      />

      <AlternativeBudgetsDialog
        selectedBudgetAlternatives={selectedBudgetAlternatives}
        onClose={() => setSelectedBudgetAlternatives(null)}
        getAlternativeBudgetsByBudgetId={getAlternativeBudgetsByBudgetId}
        getCompanyById={getCompanyById}
        budgets={budgets}
        formatCurrency={formatCurrency}
        onGeneratePDF={generatePDF}
      />
    </Layout>
  );
};

export default BudgetsPage;
