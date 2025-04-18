
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BudgetSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortToggle: () => void;
}

const BudgetSearch = ({
  searchTerm,
  onSearchChange,
  sortOrder,
  onSortToggle,
}: BudgetSearchProps) => {
  return (
    <div className="flex items-center gap-2 mt-2">
      <Search className="text-gray-400 h-4 w-4" />
      <Input
        placeholder="Buscar por cliente ou empresa..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={onSortToggle}
        className="ml-auto"
      >
        Ordenar por data: {sortOrder === "asc" ? "↑" : "↓"}
      </Button>
    </div>
  );
};

export default BudgetSearch;
