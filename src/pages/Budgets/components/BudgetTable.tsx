import { Link } from "react-router-dom";
import { Budget } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertTriangle, Edit, FileText, FilePlus, Eye, Trash2 } from "lucide-react";
import BudgetStatus from "./BudgetStatus";

interface BudgetTableProps {
  budgets: Budget[];
  getCompanyById: (id: string) => { nome: string } | undefined;
  onDeleteClick: (id: string) => void;
  onGeneratePDFs: (budget: Budget) => void;
  formatDate: (date: string) => string;
  formatCurrency: (value: number) => string;
  calculateTotal: (budget: Budget) => number;
  onViewAlternativeBudgets?: (budgetId: string) => void;
}

const BudgetTable = ({
  budgets,
  getCompanyById,
  onDeleteClick,
  onGeneratePDFs,
  formatDate,
  formatCurrency,
  calculateTotal,
  onViewAlternativeBudgets,
}: BudgetTableProps) => {
  if (budgets.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center h-24">
          <div className="flex flex-col items-center justify-center text-sm">
            <AlertTriangle className="h-10 w-10 text-gray-400 mb-2" />
            <p>Nenhum orçamento cadastrado ainda</p>
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
        <TableRow key={budget.id}>
          <TableCell className="font-medium">
            {budget.cliente}
          </TableCell>
          <TableCell>
            {getCompanyById(budget.empresa_base_id)?.nome || "N/A"}
          </TableCell>
          <TableCell>{formatDate(budget.data_criacao)}</TableCell>
          <TableCell>
            <BudgetStatus creationDate={budget.data_criacao} />
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
                    onClick={() => onGeneratePDFs(budget)}
                  >
                    <FilePlus className="h-4 w-4 mr-2" />
                    Gerar PDFs
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {onViewAlternativeBudgets && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onViewAlternativeBudgets(budget.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}

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
                onClick={() => onDeleteClick(budget.id)}
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
