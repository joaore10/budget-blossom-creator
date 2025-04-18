
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { DashboardMetrics } from "@/components/DashboardMetrics";

const CompaniesPage = () => {
  const navigate = useNavigate();
  const { companies } = useData();

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Empresas</h1>
          <Button onClick={() => navigate("/empresas/nova")}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Empresa
          </Button>
        </div>

        <DashboardMetrics />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Representante</TableHead>
                <TableHead>Endereço</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow
                  key={company.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => navigate(`/empresas/editar/${company.id}`)}
                >
                  <TableCell>{company.nome}</TableCell>
                  <TableCell>{company.cnpj}</TableCell>
                  <TableCell>{company.representante}</TableCell>
                  <TableCell>{company.endereco}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default CompaniesPage;
