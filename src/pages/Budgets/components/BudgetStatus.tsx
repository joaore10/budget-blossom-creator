
import { Badge } from "@/components/ui/badge";

interface BudgetStatusProps {
  creationDate: string;
}

const BudgetStatus = ({ creationDate }: BudgetStatusProps) => {
  const getBudgetStatus = (dateString: string) => {
    const creation = new Date(dateString);
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

  return getBudgetStatus(creationDate);
};

export default BudgetStatus;
