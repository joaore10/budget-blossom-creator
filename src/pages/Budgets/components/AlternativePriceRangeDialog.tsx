
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface AlternativePriceRangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (range: number) => void;
}

const AlternativePriceRangeDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: AlternativePriceRangeDialogProps) => {
  const [range, setRange] = useState(10); // Default 10%

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Definir variação de preço</DialogTitle>
          <DialogDescription>
            Defina a porcentagem máxima de aumento nos preços dos itens
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Variação máxima:</span>
              <span className="font-medium">{range}%</span>
            </div>
            <Slider
              value={[range]}
              onValueChange={(values) => setRange(values[0])}
              min={1}
              max={100}
              step={1}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onConfirm(range)}>
            Gerar orçamentos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlternativePriceRangeDialog;
