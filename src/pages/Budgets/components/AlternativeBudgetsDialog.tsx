
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { Company, Budget, AlternativeBudget } from "@/types";

interface AlternativeBudgetsDialogProps {
  selectedBudgetAlternatives: string | null;
  onClose: () => void;
  getAlternativeBudgetsByBudgetId: (budgetId: string) => AlternativeBudget[];
  getCompanyById: (id: string) => Company | undefined;
  budgets: Budget[];
  formatCurrency: (value: number) => string;
  onGeneratePDF: (budget: Budget, company: Company, alternativeBudget: AlternativeBudget) => void;
}

const AlternativeBudgetsDialog = ({
  selectedBudgetAlternatives,
  onClose,
  getAlternativeBudgetsByBudgetId,
  getCompanyById,
  budgets,
  formatCurrency,
  onGeneratePDF,
}: AlternativeBudgetsDialogProps) => {
  const calculateTotal = (altBudget: AlternativeBudget) => {
    return altBudget.itens_com_valores_alterados.reduce(
      (sum, item) => sum + item.quantidade * item.valor_unitario,
      0
    );
  };

  return (
    <Dialog open={!!selectedBudgetAlternatives} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Orçamentos Alternativos</DialogTitle>
          <DialogDescription>
            Visualize e baixe os orçamentos alternativos gerados
          </DialogDescription>
        </DialogHeader>
        {selectedBudgetAlternatives && (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getAlternativeBudgetsByBudgetId(selectedBudgetAlternatives).map((altBudget) => {
                  const company = getCompanyById(altBudget.empresa_id);
                  const budget = budgets.find(b => b.id === altBudget.orcamento_id);
                  
                  return (
                    <TableRow key={altBudget.id}>
                      <TableCell>{company?.nome || 'N/A'}</TableCell>
                      <TableCell>
                        {formatCurrency(calculateTotal(altBudget))}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => budget && company && onGeneratePDF(budget, company, altBudget)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => budget && company && onGeneratePDF(budget, company, altBudget)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Baixar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => onClose()}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlternativeBudgetsDialog;
