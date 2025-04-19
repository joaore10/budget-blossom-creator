import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, Users, PlusCircle, Home, Menu, X } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigation = [
    { name: "Início", href: "/", icon: Home },
    { name: "Empresas", href: "/empresas", icon: Users },
    { name: "Orçamentos", href: "/orcamentos", icon: FileText },
    { name: "Novo Orçamento", href: "/orcamentos/novo", icon: PlusCircle },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path === "/empresas" && (location.pathname === "/empresas" || location.pathname.startsWith("/empresas/"))) return true;
    if (path === "/orcamentos" && location.pathname === "/orcamentos") return true;
    if (path === "/orcamentos/novo" && location.pathname === "/orcamentos/novo") return true;
    
    return false;
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-md bg-budget-700 text-white"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      {/* Sidebar - desktop visible, mobile toggleable */}
      <aside 
        className={cn(
          "bg-budget-700 text-white w-64 flex flex-col min-h-screen",
          "fixed md:sticky top-0 z-40",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
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
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
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

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto md:ml-0">
        <div className="container mx-auto py-8 px-4 animate-fade-enter">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
