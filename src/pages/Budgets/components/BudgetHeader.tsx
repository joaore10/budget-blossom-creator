
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const BudgetHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Orçamentos</h1>
        <p className="text-gray-500">
          Gerencie os orçamentos criados no sistema
        </p>
      </div>
      <Button asChild>
        <Link to="/orcamentos/novo">
          <Plus className="mr-2 h-4 w-4" />
          Novo Orçamento
        </Link>
      </Button>
    </div>
  );
};

export default BudgetHeader;
