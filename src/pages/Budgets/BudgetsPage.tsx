import { useState, useEffect, useCallback } from 'react';
import Layout from "@/components/Layout";
import BudgetTable from "./components/BudgetTable";
import { Company, Budget, AlternativeBudget } from "@/types";
import { useCompanies } from "@/hooks/useCompanies";
import { useBudgets } from "@/hooks/useBudgets";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { generatePDF } from "@/lib/pdf";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AlternativeBudgetsDialog from './components/AlternativeBudgetsDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import AlternativePriceRangeDialog from './components/AlternativePriceRangeDialog';

export default function BudgetsPage() {
  const { companies, getCompanyById, isLoading: isLoadingCompanies } = useCompanies();
  const {
    budgets,
    isLoading: isLoadingBudgets,
    deleteBudget,
    getAlternativeBudgetsByBudgetId,
    generateAlternativeBudgets,
    setBudgets
  } = useBudgets();
  const [selectedBudgetAlternatives, setSelectedBudgetAlternatives] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [budgetIdToDelete, setBudgetIdToDelete] = useState<string | null>(null);
  const [showPriceRangeDialog, setShowPriceRangeDialog] = useState(false);
  const [selectedBudgetForAlternatives, setSelectedBudgetForAlternatives] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBudgets, setFilteredBudgets] = useState(budgets);

  const isLoading = isLoadingCompanies || isLoadingBudgets;

  useEffect(() => {
    if (budgets.length === 0) {
      setBudgets([]);
    }
  }, [budgets.length, setBudgets]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredBudgets(
        budgets.filter((budget) =>
          budget.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getCompanyById(budget.empresa_base_id)?.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredBudgets(budgets);
    }
  }, [searchTerm, budgets, getCompanyById]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleGeneratePDF = useCallback(
    async (budget: Budget, company: Company, alternativeBudget: AlternativeBudget | undefined, shouldDownload: boolean) => {
      try {
        const success = await generatePDF(budget, company, alternativeBudget, shouldDownload);
        if (success) {
          toast.success('PDF gerado com sucesso!');
        } else {
          toast.error('Erro ao gerar PDF.');
        }
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast.error('Erro ao gerar PDF.');
      }
    }, []
  );

  const handleDelete = (id: string) => {
    setBudgetIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!budgetIdToDelete) return;
    
    try {
      await deleteBudget(budgetIdToDelete);
      setBudgetIdToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error);
    }
  };

  const handleOpenAlternatives = (budgetId: string) => {
    setSelectedBudgetAlternatives(budgetId);
  };

  const handleCloseAlternatives = () => {
    setSelectedBudgetAlternatives(null);
  };

  const handleGenerateAlternatives = (budgetId: string) => {
    setSelectedBudgetForAlternatives(budgetId);
    setShowPriceRangeDialog(true);
  };

  const handleConfirmPriceRange = async (range: number) => {
    if (selectedBudgetForAlternatives) {
      try {
        await generateAlternativeBudgets(selectedBudgetForAlternatives, range);
        toast.success('Orçamentos alternativos gerados com sucesso!');
        setShowPriceRangeDialog(false);
        setSelectedBudgetForAlternatives(null);
      } catch (error) {
        console.error('Erro ao gerar orçamentos alternativos:', error);
        toast.error('Erro ao gerar orçamentos alternativos');
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Orçamentos</h1>
            <p className="text-sm text-muted-foreground">
              Gerenciamento de orçamentos do sistema
            </p>
          </div>
          <Link to="/orcamentos/novo">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Orçamento
            </Button>
          </Link>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Lista de Orçamentos</CardTitle>
            <CardDescription>
              Total de {filteredBudgets.length} orçamentos cadastrados
            </CardDescription>
            <div className="flex items-center py-2">
              <input
                type="text"
                placeholder="Buscar orçamento..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="text-center p-4 font-medium text-muted-foreground">Cliente</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">Empresa</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">Data</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">Valor</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <BudgetTable
                      budgets={filteredBudgets}
                      companies={companies}
                      isLoading={isLoading}
                      formatCurrency={formatCurrency}
                      onGeneratePDF={handleGeneratePDF}
                      onDelete={handleDelete}
                      onOpenAlternatives={handleOpenAlternatives}
                      onGenerateAlternatives={handleGenerateAlternatives}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        <AlternativePriceRangeDialog
          open={showPriceRangeDialog}
          onOpenChange={setShowPriceRangeDialog}
          onConfirm={handleConfirmPriceRange}
        />

        <AlternativeBudgetsDialog
          selectedBudgetAlternatives={selectedBudgetAlternatives}
          onClose={handleCloseAlternatives}
          getAlternativeBudgetsByBudgetId={() => getAlternativeBudgetsByBudgetId(selectedBudgetAlternatives!)}
          getCompanyById={getCompanyById}
          budgets={budgets}
          formatCurrency={formatCurrency}
          onGeneratePDF={handleGeneratePDF}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={confirmDelete}
        />
      </div>
    </Layout>
  );
}
