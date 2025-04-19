
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPriceRangeDialog, setShowPriceRangeDialog] = useState(false);
  const [selectedBudgetForAlternatives, setSelectedBudgetForAlternatives] = useState<string | null>(null);

  const isLoading = isLoadingCompanies || isLoadingBudgets;

  useEffect(() => {
    if (budgets.length === 0) {
      setBudgets([]);
    }
  }, [budgets.length, setBudgets]);

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
    if (budgetIdToDelete) {
      setIsDeleting(true);
      try {
        await deleteBudget(budgetIdToDelete);
        toast.success('Orçamento excluído com sucesso');
      } catch (error) {
        console.error('Erro ao excluir orçamento:', error);
        toast.error('Erro ao excluir orçamento');
      } finally {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        setBudgetIdToDelete(null);
      }
    }
  };

  const handleOpenAlternatives = (budgetId: string) => {
    setSelectedBudgetAlternatives(budgetId);
  };

  const handleCloseAlternatives = () => {
    setSelectedBudgetAlternatives(null);
  };

  const handleGenerateAlternatives = async (budgetId: string) => {
    setSelectedBudgetForAlternatives(budgetId);
    setShowPriceRangeDialog(true);
  };

  const handleConfirmPriceRange = async (range: number) => {
    if (selectedBudgetForAlternatives) {
      try {
        await generateAlternativeBudgets(selectedBudgetForAlternatives, range);
        setShowPriceRangeDialog(false);
        setSelectedBudgetForAlternatives(null);
      } catch (error) {
        console.error('Erro ao gerar orçamentos alternativos:', error);
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Orçamentos</h1>
          <Link to="/budgets/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Orçamento
            </Button>
          </Link>
        </div>

        <BudgetTable
          budgets={budgets}
          companies={companies}
          isLoading={isLoading}
          formatCurrency={formatCurrency}
          onGeneratePDF={handleGeneratePDF}
          onDelete={handleDelete}
          onOpenAlternatives={handleOpenAlternatives}
          onGenerateAlternatives={handleGenerateAlternatives}
        />

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
          isDeleting={isDeleting}
        />
      </div>
    </Layout>
  );
}
