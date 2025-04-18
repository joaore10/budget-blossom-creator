
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useData } from "@/contexts/DataContext";
import { FileText, Users, AlertTriangle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { companies, budgets } = useData();
  
  // Filter budgets created in the last 30 days
  const recentBudgets = budgets.filter((budget) => {
    const creationDate = new Date(budget.data_criacao);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return creationDate >= thirtyDaysAgo;
  });

  return (
    <Layout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-budget-600" />
              Empresas Cadastradas
            </CardTitle>
            <CardDescription>Total de empresas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{companies.length}</div>
            <div className="mt-4">
              <Button variant="outline" asChild className="w-full">
                <Link to="/empresas">Gerenciar Empresas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-budget-600" />
              Orçamentos Recentes
            </CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{recentBudgets.length}</div>
            <div className="mt-4">
              <Button variant="outline" asChild className="w-full">
                <Link to="/orcamentos">Ver Orçamentos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Orçamentos Expirando
            </CardTitle>
            <CardDescription>Nos próximos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const today = new Date();
              const sevenDaysFromNow = new Date();
              sevenDaysFromNow.setDate(today.getDate() + 7);
              const thirtyDaysAfterCreation = budgets.filter((budget) => {
                const creationDate = new Date(budget.data_criacao);
                const expirationDate = new Date(creationDate);
                expirationDate.setDate(creationDate.getDate() + 30);
                return expirationDate >= today && expirationDate <= sevenDaysFromNow;
              });

              return (
                <>
                  <div className="text-3xl font-bold">{thirtyDaysAfterCreation.length}</div>
                  <div className="mt-4">
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/orcamentos">Verificar</Link>
                    </Button>
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse as principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Button asChild variant="default" className="h-20 text-lg flex items-center gap-3">
              <Link to="/orcamentos/novo">
                <PlusCircle className="h-6 w-6" />
                <span>Criar Novo Orçamento</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 text-lg flex items-center gap-3">
              <Link to="/empresas/nova">
                <Users className="h-6 w-6" />
                <span>Cadastrar Nova Empresa</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
