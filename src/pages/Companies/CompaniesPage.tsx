
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CompaniesPage = () => {
  const { companies, deleteCompany } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [filteredCompanies, setFilteredCompanies] = useState(companies);

  useEffect(() => {
    if (searchTerm) {
      setFilteredCompanies(
        companies.filter((company) =>
          company.nome.toLowerCase().includes(searchTerm.toLowerCase())
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

  const confirmDelete = async () => {
    if (companyToDelete) {
      try {
        await deleteCompany(companyToDelete);
        setDeleteConfirmOpen(false);
        setCompanyToDelete(null);
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível excluir a empresa");
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Empresas</h1>
            <p className="text-sm text-muted-foreground">
              Gerenciamento de empresas do sistema
            </p>
          </div>
          <Button onClick={() => navigate("/empresas/nova")} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Nova Empresa
          </Button>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Lista de Empresas</CardTitle>
            <CardDescription>
              Total de {filteredCompanies.length} empresas cadastradas
            </CardDescription>
            <div className="flex items-center py-2">
              <input
                type="text"
                placeholder="Buscar empresa..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-center">Nome Fantasia</TableHead>
                    <TableHead className="font-semibold text-center">Razão Social</TableHead>
                    <TableHead className="font-semibold text-center">CNPJ</TableHead>
                    <TableHead className="font-semibold text-center">Contato</TableHead>
                    <TableHead className="font-semibold text-center">Representante</TableHead>
                    <TableHead className="font-semibold text-center">Endereço</TableHead>
                    <TableHead className="text-center font-semibold w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        Nenhuma empresa encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCompanies.map((company) => (
                      <TableRow key={company.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-center">
                          <div className="flex items-center justify-center gap-2">
                            {company.logo && (
                              <img 
                                src={company.logo} 
                                alt={`Logo ${company.nome}`} 
                                className="w-8 h-8 object-contain"
                              />
                            )}
                            {company.nome}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{company.razao_social || "-"}</TableCell>
                        <TableCell className="text-center">{company.cnpj}</TableCell>
                        <TableCell className="text-center">
                          <div className="space-y-1 flex flex-col items-center">
                            {company.telefone && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3" />
                                {company.telefone}
                              </div>
                            )}
                            {company.email && (
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3" />
                                {company.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{company.representante}</TableCell>
                        <TableCell className="max-w-[250px] truncate text-center" title={company.endereco}>
                          {company.endereco}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/empresas/editar/${company.id}`)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(company.id)}
                              className="h-8 w-8 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {deleteConfirmOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold mb-4">Confirmar exclusão</h2>
              <p className="mb-6">
                Esta ação não pode ser desfeita. Tem certeza que deseja excluir esta empresa?
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CompaniesPage;
