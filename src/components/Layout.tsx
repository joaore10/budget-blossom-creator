
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, Users, PlusCircle, Home } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navigation = [
    { name: "Início", href: "/", icon: Home },
    { name: "Empresas", href: "/empresas", icon: Users },
    { name: "Orçamentos", href: "/orcamentos", icon: FileText },
    { name: "Novo Orçamento", href: "/orcamentos/novo", icon: PlusCircle },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="bg-budget-700 text-white w-64 flex flex-col">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Gerador de Orçamentos</h1>
        </div>
        <nav className="flex-1 mt-6">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm",
                    isActive(item.href)
                      ? "bg-budget-600 font-medium"
                      : "hover:bg-budget-600/75 transition-colors"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 text-xs text-budget-300">
          <p>© {new Date().getFullYear()} - Gerador de Orçamentos</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-8 px-4 animate-fade-enter">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
