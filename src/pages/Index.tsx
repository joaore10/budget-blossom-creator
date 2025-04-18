
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { seedInitialCompanies } from "@/utils/seedCompanies";
import { toast } from "sonner";
import { DashboardMetrics } from "@/components/DashboardMetrics";

const Index = () => {
  const navigate = useNavigate();

  const handleSeedCompanies = async () => {
    try {
      await seedInitialCompanies();
      toast.success("Empresas cadastradas com sucesso!");
      navigate("/empresas");
    } catch (error) {
      toast.error("Erro ao cadastrar empresas");
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Bem-vindo ao Gerador de Orçamentos</h1>
          <p className="mt-2 text-lg text-gray-600">
            Gerencie suas empresas e gere orçamentos de forma simples e rápida.
          </p>
        </div>

        <DashboardMetrics />

        <div className="grid gap-4">
          <Button onClick={() => navigate("/empresas")}>
            Ver Empresas Cadastradas
          </Button>
          <Button onClick={() => navigate("/orcamentos")}>
            Ver Orçamentos
          </Button>
          <Button variant="outline" onClick={handleSeedCompanies}>
            Cadastrar Empresas Iniciais
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

