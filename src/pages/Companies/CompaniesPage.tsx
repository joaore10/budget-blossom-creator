
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const CompaniesPage = () => {
  const { companies, deleteCompany } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState(companies);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (searchTerm) {
      setFilteredCompanies(
        companies.filter(
          (company) =>
            company.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.cnpj.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCompanies(companies);
    }
  }, [searchTerm, companies]);

  const handleDeleteClick = (companyId: string) => {
    setCompanyToDelete(companyId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (companyToDelete) {
      deleteCompany(companyToDelete);
      setDeleteConfirmOpen(false);
      setCompanyToDelete(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Empresas</h1>
            <p className="text-gray-500">
              Gerencie as empresas cadastradas no sistema
            </p>
          </div>
          <Button asChild>
            <Link to="/empresas/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova Empresa
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista de Empresas</CardTitle>
            <CardDescription>
              Total de {filteredCompanies.length} empresas cadastradas
            </CardDescription>

            <div className="flex items-center gap-2 mt-2">
              <Search className="text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Representante</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">
                          {company.nome}
                        </TableCell>
                        <TableCell>{company.cnpj}</TableCell>
                        <TableCell>{company.representante}</TableCell>
                        <TableCell>{company.endereco}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="h-8 w-8 p-0"
                            >
                              <Link to={`/empresas/editar/${company.id}`}>
                                <span className="sr-only">Editar</span>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleDeleteClick(company.id)}
                            >
                              <span className="sr-only">Excluir</span>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        <div className="flex flex-col items-center justify-center text-sm">
                          <AlertTriangle className="h-10 w-10 text-gray-400 mb-2" />
                          {searchTerm ? (
                            <p>
                              Nenhuma empresa encontrada para{" "}
                              <strong>"{searchTerm}"</strong>
                            </p>
                          ) : (
                            <p>Nenhuma empresa cadastrada ainda</p>
                          )}
                          <Button
                            variant="link"
                            className="mt-2"
                            asChild
                          >
                            <Link to="/empresas/nova">
                              Cadastrar nova empresa
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Tem certeza que deseja excluir
              esta empresa?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CompaniesPage;
