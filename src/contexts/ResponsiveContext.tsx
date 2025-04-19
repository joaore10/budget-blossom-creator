
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type BreakpointType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ResponsiveContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: BreakpointType;
}

const ResponsiveContext = createContext<ResponsiveContextType>({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  breakpoint: 'xl'
});

export const useResponsive = () => useContext(ResponsiveContext);

interface ResponsiveProviderProps {
  children: ReactNode;
}

export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children }) => {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  });

  useEffect(() => {
    // Handler para atualizar o tamanho da janela
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Adiciona o event listener
    window.addEventListener('resize', handleResize);
    
    // Remove o event listener quando o componente é desmontado
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determina o breakpoint atual
  const getBreakpoint = (): BreakpointType => {
    const { width } = windowSize;
    if (width < 640) return 'xs';
    if (width < 768) return 'sm';
    if (width < 1024) return 'md';
    if (width < 1280) return 'lg';
    if (width < 1536) return 'xl';
    return '2xl';
  };

  const breakpoint = getBreakpoint();
  const isMobile = breakpoint === 'xs' || breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';

  const value = {
    isMobile,
    isTablet,
    isDesktop,
    breakpoint
  };

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};
