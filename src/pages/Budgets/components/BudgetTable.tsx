import { Link } from "react-router-dom";
import { Budget, Company, AlternativeBudget } from "@/types";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, FileText, Eye, Trash2, AlertTriangle, BarChart } from "lucide-react";
import BudgetStatus from "./BudgetStatus";

interface BudgetTableProps {
  budgets: Budget[];
  companies?: Company[];
  isLoading?: boolean;
  formatCurrency: (value: number) => string;
  onGeneratePDF: (budget: Budget, company: Company, alternativeBudget: AlternativeBudget | undefined, shouldDownload: boolean) => Promise<void>;
  onDelete: (id: string) => void;
  onOpenAlternatives?: (budgetId: string) => void;
  onGenerateAlternatives?: (budgetId: string) => void;
}

const BudgetTable = ({
  budgets,
  companies,
  isLoading,
  formatCurrency,
  onGeneratePDF,
  onDelete,
  onOpenAlternatives,
  onGenerateAlternatives,
}: BudgetTableProps) => {
  // Helper function to get company by ID
  const getCompanyById = (id: string): { nome: string } | undefined => {
    return companies?.find(company => company.id === id);
  };

  // Helper function to calculate total
  const calculateTotal = (budget: Budget): number => {
    return budget.itens.reduce(
      (total, item) => total + (item.quantidade * item.valor_unitario),
      0
    );
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center h-24">
          <div className="flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
            <span className="ml-2">Carregando...</span>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (budgets.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center h-24">
          <div className="flex flex-col items-center justify-center text-sm">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Nenhum orçamento encontrado</p>
            <Button variant="link" className="mt-2" asChild>
              <Link to="/orcamentos/novo">
                Criar novo orçamento
              </Link>
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {budgets.map((budget) => (
        <TableRow key={budget.id} className="hover:bg-muted/50 transition-colors">
          <TableCell className="text-center font-medium">
            {budget.cliente}
          </TableCell>
          <TableCell className="text-center text-muted-foreground">
            {getCompanyById(budget.empresa_base_id)?.nome || "N/A"}
          </TableCell>
          <TableCell className="text-center text-muted-foreground">
            {formatDate(budget.data_criacao)}
          </TableCell>
          <TableCell className="text-center">
            <BudgetStatus creationDate={budget.data_criacao} />
          </TableCell>
          <TableCell className="text-center font-medium">
            {formatCurrency(calculateTotal(budget))}
          </TableCell>
          <TableCell className="text-center">
            <div className="flex space-x-2 justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted hover:text-primary transition-colors"
                onClick={() => {
                  const company = getCompanyById(budget.empresa_base_id);
                  if (company) {
                    onGeneratePDF(budget, company as Company, undefined, true);
                  }
                }}
                title="Gerar PDF"
              >
                <FileText className="h-4 w-4" />
              </Button>
              
              {onOpenAlternatives && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-muted hover:text-primary transition-colors"
                  onClick={() => onOpenAlternatives(budget.id)}
                  title="Ver alternativas"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}

              {onGenerateAlternatives && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-muted hover:text-primary transition-colors"
                  onClick={() => onGenerateAlternatives(budget.id)}
                  title="Gerar alternativas"
                >
                  <BarChart className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-8 w-8 hover:bg-muted hover:text-primary transition-colors"
                title="Editar"
              >
                <Link to={`/orcamentos/editar/${budget.id}`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={() => onDelete(budget.id)}
                title="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default BudgetTable;
