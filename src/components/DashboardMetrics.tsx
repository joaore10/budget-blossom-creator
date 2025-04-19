
import { useData } from "@/contexts/DataContext";
import { useResponsive } from "@/contexts/ResponsiveContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, AlertTriangle } from "lucide-react";

export function DashboardMetrics() {
  const { companies, budgets } = useData();
  const { isMobile } = useResponsive();

  // Calculate expiring budgets (within 7 days)
  const expiringBudgets = budgets.filter(budget => {
    const expirationDate = new Date(budget.data_criacao);
    expirationDate.setDate(expirationDate.getDate() + 30);
    const daysToExpiration = Math.ceil(
      (expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysToExpiration > 0 && daysToExpiration <= 7;
  });

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <MetricCard 
        title="Empresas Cadastradas"
        value={companies.length}
        icon={Building2}
        trend={companies.length > 0 ? "up" : "neutral"}
        isMobile={isMobile}
      />
      
      <MetricCard 
        title="Total de Orçamentos"
        value={budgets.length}
        icon={FileText}
        trend={budgets.length > 3 ? "up" : budgets.length > 0 ? "neutral" : "down"}
        isMobile={isMobile}
      />
      
      <MetricCard 
        title="Orçamentos a Vencer"
        value={expiringBudgets.length}
        icon={AlertTriangle}
        trend={expiringBudgets.length > 0 ? "warning" : "neutral"}
        isMobile={isMobile}
        warningLevel={expiringBudgets.length > 3 ? "high" : expiringBudgets.length > 0 ? "medium" : "low"}
      />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  trend: "up" | "down" | "neutral" | "warning";
  isMobile?: boolean;
  warningLevel?: "low" | "medium" | "high";
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon: Icon,
  trend,
  isMobile,
  warningLevel = "low" 
}) => {
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-blue-500",
    warning: "text-amber-500"
  };
  
  const warningColors = {
    low: "",
    medium: "border-l-4 border-amber-400",
    high: "border-l-4 border-red-500"
  };

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${warningColors[warningLevel]}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${trendColors[trend]}`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline">
          <div className="text-3xl font-bold">{value}</div>
          {!isMobile && (
            <div className={`ml-2 text-xs ${trendColors[trend]}`}>
              {trend === "up" && "↑"}
              {trend === "down" && "↓"}
              {trend === "neutral" && "→"}
              {trend === "warning" && "⚠️"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
