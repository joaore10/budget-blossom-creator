
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
import { Eye, Download } from "lucide-react";
import { Company, Budget, AlternativeBudget } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { generatePreviewHTML } from "@/lib/pdf/preview-generator";
import { useState, useEffect } from "react";

interface AlternativeBudgetsDialogProps {
  selectedBudgetAlternatives: string | null;
  onClose: () => void;
  getAlternativeBudgetsByBudgetId: () => Promise<AlternativeBudget[]>;
  getCompanyById: (id: string) => Company | undefined;
  budgets: Budget[];
  formatCurrency: (value: number) => string;
  onGeneratePDF: (budget: Budget, company: Company, alternativeBudget: AlternativeBudget | undefined, shouldDownload: boolean) => void;
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
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [alternativeBudgets, setAlternativeBudgets] = useState<AlternativeBudget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load alternative budgets when the dialog opens
  useEffect(() => {
    const loadAlternatives = async () => {
      if (selectedBudgetAlternatives) {
        setIsLoading(true);
        try {
          const results = await getAlternativeBudgetsByBudgetId();
          setAlternativeBudgets(results);
          console.log("Loaded alternative budgets:", results);
        } catch (error) {
          console.error("Error loading alternative budgets:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setAlternativeBudgets([]);
      }
    };
    
    loadAlternatives();
  }, [selectedBudgetAlternatives, getAlternativeBudgetsByBudgetId]);
  
  const calculateTotal = (altBudget: AlternativeBudget) => {
    return altBudget.itens_com_valores_alterados.reduce(
      (sum, item) => sum + item.quantidade * item.valor_unitario,
      0
    );
  };

  const baseBudget = budgets.find(b => b.id === selectedBudgetAlternatives);
  const company = baseBudget ? getCompanyById(baseBudget.empresa_base_id) : undefined;

  const handlePreview = (budget: Budget, previewCompany: Company, alternativeBudget?: AlternativeBudget) => {
    const previewContent = generatePreviewHTML(budget, previewCompany, alternativeBudget);
    setPreviewHtml(previewContent);
  };

  return (
    <Dialog open={!!selectedBudgetAlternatives} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Orçamentos</DialogTitle>
          <DialogDescription>
            Visualize todos os orçamentos gerados
          </DialogDescription>
        </DialogHeader>
        {selectedBudgetAlternatives && baseBudget && company && (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Base Budget Row */}
                <TableRow>
                  <TableCell>{company.nome}</TableCell>
                  <TableCell>Original</TableCell>
                  <TableCell>
                    {formatCurrency(baseBudget.itens.reduce(
                      (sum, item) => sum + item.quantidade * item.valor_unitario,
                      0
                    ))}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(baseBudget, company)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-[1100px]">
                          <SheetHeader>
                            <SheetTitle>Prévia do Orçamento</SheetTitle>
                          </SheetHeader>
                          <div 
                            className="mt-4 overflow-auto max-h-[calc(100vh-100px)] pdf-preview-container"
                            dangerouslySetInnerHTML={{ __html: previewHtml }}
                          />
                        </SheetContent>
                      </Sheet>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onGeneratePDF(baseBudget, company, undefined, true)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Loading indicator */}
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
                        <span className="ml-2">Carregando orçamentos alternativos...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* No alternative budgets message */}
                {!isLoading && alternativeBudgets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      <p className="text-muted-foreground">Nenhum orçamento alternativo encontrado</p>
                    </TableCell>
                  </TableRow>
                )}

                {/* Alternative Budgets Rows */}
                {!isLoading && alternativeBudgets.map((altBudget) => {
                  const altCompany = getCompanyById(altBudget.empresa_id);
                  
                  if (!altCompany) return null;
                  
                  return (
                    <TableRow key={altBudget.id}>
                      <TableCell>{altCompany.nome}</TableCell>
                      <TableCell>Alternativo</TableCell>
                      <TableCell>
                        {formatCurrency(calculateTotal(altBudget))}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePreview(baseBudget, altCompany, altBudget)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Visualizar
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="sm:max-w-[1100px]">
                              <SheetHeader>
                                <SheetTitle>Prévia do Orçamento</SheetTitle>
                              </SheetHeader>
                              <div 
                                className="mt-4 overflow-auto max-h-[calc(100vh-100px)] pdf-preview-container"
                                dangerouslySetInnerHTML={{ __html: previewHtml }}
                              />
                            </SheetContent>
                          </Sheet>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onGeneratePDF(baseBudget, altCompany, altBudget, true)}
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
