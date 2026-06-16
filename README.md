🍔 Assadinhos da Cantonera
Uma plataforma moderna e intuitiva para venda de lanches, desenvolvida com o objetivo de facilitar a experiência de compra do público, conectando clientes aos melhores sabores de forma rápida e prática.

🚀 Tecnologias Utilizadas
O projeto está dividido em duas partes principais: Frontend (Interface do Usuário) e Backend (API e Banco de Dados).

Frontend
React (v19): Biblioteca principal para a construção da interface.

Vite: Ferramenta de build super rápida.

Tailwind CSS (v4): Estilização utilitária para um design responsivo e moderno.

React Router: Gerenciamento de rotas e navegação.

Axios: Cliente HTTP para comunicação com a API.

React Toastify: Notificações amigáveis e elegantes para o usuário.

Backend
Node.js & Express (v5): Estrutura e rotas da API.

MySQL2: Conexão e integração com o banco de dados relacional.

Bcrypt: Criptografia de senhas para garantir a segurança dos usuários.

Dotenv: Gerenciamento de variáveis de ambiente.

CORS: Controle de acesso HTTP.

📋 Pré-requisitos
Antes de começar, você precisará ter as seguintes ferramentas instaladas na sua máquina:

Node.js (Versão recomendada: 18+ ou 20+)

MySQL (Servidor de banco de dados rodando)

Git (Para clonar o repositório)

🔧 Como instalar e rodar o projeto
1. Clonando o repositório
Bash
git clone https://github.com/seu-usuario/assadinhos-da-cantonera.git
cd assadinhos-da-cantonera
2. Configurando o Backend (API)
Navegue até a pasta do backend, instale as dependências e configure o ambiente:

Bash
cd backend
npm install
Crie um arquivo .env na raiz da pasta backend com as seguintes variáveis de configuração do seu banco de dados:

Snippet de código
PORT=3000
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=assadinhos_db
Inicie o servidor de desenvolvimento (utiliza nodemon para reinicialização automática):

Bash
npm start
O backend estará rodando em http://localhost:3000.

3. Configurando o Frontend
Abra um novo terminal, navegue até a pasta do frontend e instale as dependências:

Bash
cd frontend
npm install
Inicie o servidor de desenvolvimento do Vite:

Bash
npm run dev
O frontend estará rodando e acessível no seu navegador, geralmente em http://localhost:5173.

📦 Scripts Disponíveis
Frontend (/frontend)
npm run dev: Inicia o servidor de desenvolvimento.

Backend (/backend)
npm start: Inicia o servidor de desenvolvimento utilizando o Nodemon (reinicia automaticamente ao salvar arquivos).

🤝 Contribuição
Sinta-se à vontade para contribuir com o projeto! Para isso:

Faça um Fork do projeto

Crie uma branch para sua feature (git checkout -b feature/NovaFeature)

Faça o commit das suas alterações (git commit -m 'Adicionando uma nova feature')

Faça o push para a branch (git push origin feature/NovaFeature)

Abra um Pull Request