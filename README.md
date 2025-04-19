
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/a0da220e-9c14-42ad-a23a-8bce329f4ef5

## Rodando o Projeto Localmente

### Pré-requisitos

- Node.js & npm - [instale via nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Git instalado na sua máquina

### Passos para Execução Local

1. Clone o repositório:
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Instale as dependências:
```sh
npm install
```

3. Configure o Banco de Dados SQLite Local:

O projeto usa SQLite para armazenamento local dos dados. O arquivo do banco de dados será criado automaticamente em `data/local.sqlite` quando você iniciar o projeto pela primeira vez.

> **Importante**: O arquivo `data/local.sqlite` já está configurado no `.gitignore` para garantir que seus dados locais não sejam enviados para o repositório.

4. Inicie o servidor de desenvolvimento:
```sh
npm run dev
```

5. Acesse o projeto em seu navegador:
```
http://localhost:5173
```

### Compilando para Produção

Para compilar o projeto para produção, siga estes passos:

1. Limpar a pasta `dist` anterior (opcional):
```sh
rm -rf dist
```

2. Compilar o projeto:
```sh
npm run build
```

3. Após a compilação, a pasta `dist` conterá todos os arquivos necessários para deploy.

4. Para testar a versão compilada localmente:
```sh
npm run preview
```

5. Para deploy no XAMPP:
   - Copie todo o conteúdo da pasta `dist` para sua pasta `htdocs/seu-projeto`
   - Acesse via `http://localhost/seu-projeto`
   
> **Dica**: Se enfrentar problemas com cache do navegador, pressione Ctrl+F5 para forçar um refresh completo, ou abra no modo anônimo/privado.

### Persistência de Dados

- Todos os dados que você adicionar serão salvos automaticamente no arquivo `data/local.sqlite`
- Este arquivo contém todo o banco de dados local e persiste entre as execuções do projeto
- Você pode fazer backup deste arquivo copiando `data/local.sqlite` para um local seguro

### Estrutura do Banco de Dados Local

O banco SQLite local contém as seguintes tabelas:
- `companies`: Armazena as informações das empresas
- `budgets`: Armazena os orçamentos
- `alternative_budgets`: Armazena os orçamentos alternativos

### Dados Iniciais (Seed)

Para popular o banco com dados iniciais de exemplo, você pode:

1. Acessar a página inicial do projeto
2. Clicar no botão "Cadastrar Empresas Iniciais"

Ou executar manualmente através do console:
```javascript
import { seedInitialData } from "@/utils/seedData";
await seedInitialData();
```

## Como editar este código?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a0da220e-9c14-42ad-a23a-8bce329f4ef5) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Que tecnologias são usadas neste projeto?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Como faço deploy deste projeto?

Simply open [Lovable](https://lovable.dev/projects/a0da220e-9c14-42ad-a23a-8bce329f4ef5) and click on Share -> Publish.

## Posso conectar um domínio personalizado ao meu projeto Lovable?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
