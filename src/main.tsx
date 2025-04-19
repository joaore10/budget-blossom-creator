
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { runInitialSeed } from './utils/seedData';

// Executa o seed inicial quando o app inicia
runInitialSeed().then(() => {
  console.log('Database initialization completed');
}).catch(error => {
  console.error('Error initializing database:', error);
});

createRoot(document.getElementById("root")!).render(<App />);
