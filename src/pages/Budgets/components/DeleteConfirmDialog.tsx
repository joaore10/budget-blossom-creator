
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

const DeleteConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmDialogProps) => {
  const [internalIsDeleting, setInternalIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setInternalIsDeleting(true);
    try {
      await onConfirm();
      toast.success("Orçamento excluído com sucesso");
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao excluir orçamento:", error);
      toast.error("Erro ao excluir orçamento");
    } finally {
      setInternalIsDeleting(false);
    }
  };

  const isProcessing = isDeleting || internalIsDeleting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
