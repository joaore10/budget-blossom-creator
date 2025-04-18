
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <AlertTriangle className="h-16 w-16 text-budget-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-xl text-gray-600 mb-6">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>
        <Button asChild size="lg">
          <Link to="/">Voltar para o Início</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
