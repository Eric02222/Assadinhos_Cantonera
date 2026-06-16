# 🍔 Assadinhos Cantonera — Sistema de Gestão e Vendas de Lanches

Bem-vindo ao **Assadinhos Cantonera**, uma aplicação Full-Stack desenvolvida para oferecer uma experiência de compra moderna, intuitiva e eficiente. O sistema conecta clientes a um cardápio variado de lanches, permitindo desde a escolha e pedido em tempo real até a gestão administrativa completa do estoque e produtos.

---

## 🌟 Diferenciais do Projeto

### 🛍️ Experiência do Cliente
- **Interface Intuitiva**: Design moderno desenvolvido com Tailwind CSS v4, focado em facilidade de uso e responsividade.
- **Cardápio Dinâmico**: Visualização de lanches por categorias (Fritos, Assados, Bebidas, Doces) com sistema de busca em tempo real.
- **Gestão de Pedidos**: Fluxo de compra simplificado com modal de confirmação, cálculo automático de valor total e validação de estoque.
- **Autenticação Flexível**: Possibilidade de login via E-mail ou CPF, com persistência de sessão e proteção de rotas.

### 🛡️ Gestão Administrativa (Painel do Admin)
- **Dashboard de Produtos**: Controle total (CRUD) sobre o cardápio diretamente pela interface.
- **Lógica de Inventário Inteligente**: 
    - Subtração automática de estoque ao realizar vendas.
    - Atualização automática de disponibilidade (o sistema desabilita o produto quando a quantidade atinge zero).
    - Bloqueio de pedidos que excedam o limite físico disponível.
- **Segurança**: Criptografia de senhas com `bcrypt` e níveis de acesso distintos entre cliente e administrador.

---

## 🛠️ Stack Tecnológica

### **Frontend**
- **React 19**: Construção de componentes funcionais e hooks modernos.
- **Tailwind CSS v4**: Estilização de alta performance com design utilitário.
- **React Router 7**: Gerenciamento de navegação e layouts.
- **Context API**: Gerenciamento global de estado para autenticação.
- **Axios & React Toastify**: Comunicação com a API e sistema de notificações elegantes.

### **Backend**
- **Node.js & Express 5**: Arquitetura robusta e escalável para a API.
- **MySQL**: Banco de dados relacional para armazenamento seguro e consistente.
- **Bcrypt**: Garantia de privacidade e segurança nas credenciais dos usuários.

---

## 🚀 Como Executar o Projeto

### 1. Preparação do Banco de Dados
O projeto utiliza um arquivo `dump.sql` localizado na pasta `Backend` para inicializar a estrutura.
- Importe o arquivo `Backend/dump.sql` no seu servidor MySQL.
- O banco contém usuários de teste pré-configurados (hashes bcrypt inclusos):
    - **Admin**: `admin@gmail.com` | Senha: `admin`
    - **Cliente**: `a@gmail.com` | Senha: `banana`

### 2. Configuração do Backend
```bash
cd Backend
npm install
```
Configure as variáveis de ambiente no arquivo `.env` (exemplo baseado no `db.js` e `env.js` existentes):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senai
DB_DATABASE=lanchos
PORT=8081
```
Inicie o servidor:
```bash
npm start
```

### 3. Configuração do Frontend
```bash
cd Frontend
npm install
npm run dev
```
Acesse a aplicação em `http://localhost:5173`.

---

## 📂 Estrutura de Pastas (Resumo)
- `Backend/src/controller`: Lógica de negócios (Pedidos, Lanches, Usuários, Auth).
- `Backend/src/route`: Definição dos endpoints da API.
- `Frontend/src/components`: Componentes reutilizáveis (Modal, Navbar, Forms).
- `Frontend/src/context`: Gerenciamento de estado de autenticação.
- `Frontend/src/services`: Camada de comunicação com a API (Axios).
- `Frontend/src/pages`: Telas principais da aplicação.

---

## 🤝 Contribuição
Contribuições são sempre bem-vindas! Sinta-se à vontade para abrir uma *Issue* ou enviar um *Pull Request* para melhorias no sistema.

