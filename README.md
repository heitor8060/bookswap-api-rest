# BookSwap - API REST

Projeto desenvolvido para a disciplina de Engenharia de Software 2.

## Componentes do grupo

* Luiz Gustavo Nicacio
* Heitor dos Passos Pinho

## Links para teste funcional

Repositório GitHub:

https://github.com/heitor8060/bookswap-api-rest

Aplicação funcionando via GitHub Codespaces:

https://animated-space-eureka-5656qqggwxpfv5gg-3000.app.github.dev

---

## Descrição do projeto

O BookSwap é uma aplicação web para troca de livros entre usuários. O sistema permite que usuários se cadastrem, façam login, cadastrem livros, visualizem livros disponíveis, proponham trocas e aceitem propostas de troca.

A API REST foi implementada no backend com base nos diagramas de classe e sequência produzidos nas etapas anteriores da disciplina.

### Rotas da aplicação

Cadastro:

https://animated-space-eureka-5656qqggwxpfv5gg-3000.app.github.dev/register

Login:

https://animated-space-eureka-5656qqggwxpfv5gg-3000.app.github.dev/login

Página inicial:

https://animated-space-eureka-5656qqggwxpfv5gg-3000.app.github.dev/

Livros:

https://animated-space-eureka-5656qqggwxpfv5gg-3000.app.github.dev/books

Matches:

https://animated-space-eureka-5656qqggwxpfv5gg-3000.app.github.dev/matches

Trocas:

https://animated-space-eureka-5656qqggwxpfv5gg-3000.app.github.dev/trades

Usuários:

https://animated-space-eureka-5656qqggwxpfv5gg-3000.app.github.dev/users

Perfil:

https://animated-space-eureka-5656qqggwxpfv5gg-3000.app.github.dev/profile

---

## Telas da aplicação

### Tela de cadastro

Rota no frontend:

```txt
/register
```

Descrição:

Tela usada para cadastrar um novo usuário no sistema.

Rota REST relacionada:

```http
POST /api/auth/register
```

Rota REST implementada para a avaliação:

```http
POST /api/avaliativa/usuarios
```

Exemplo de corpo da requisição:

```json
{
  "nome": "Heitor",
  "email": "heitor@email.com",
  "senha": "123456",
  "location": "Taguatinga"
}
```

---

### Tela de login

Rota no frontend:

```txt
/login
```

Descrição:

Tela usada para autenticar um usuário já cadastrado.

Rota REST relacionada:

```http
POST /api/auth/login
```

Rota REST implementada para a avaliação:

```http
POST /api/avaliativa/login
```

Exemplo de corpo da requisição:

```json
{
  "email": "heitor@email.com",
  "senha": "123456"
}
```

---

### Tela inicial / perfil do usuário

Rota no frontend:

```txt
/
```

Descrição:

Tela acessada após o login, usada para visualizar informações do usuário autenticado.

Rota REST implementada para a avaliação:

```http
GET /api/avaliativa/usuarios/:id
```

Essa rota retorna os dados do usuário e seus livros cadastrados.

---

### Tela de livros

Rota no frontend:

```txt
/books
```

Descrição:

Tela usada para visualizar e cadastrar livros do usuário.

Rotas REST implementadas para a avaliação:

```http
POST /api/avaliativa/livros
```

```http
GET /api/avaliativa/livros/disponiveis
```

Exemplo de cadastro de livro:

```json
{
  "titulo": "Dom Casmurro",
  "autor": "Machado de Assis"
}
```

A rota de cadastro cria um livro disponível para troca e vinculado ao usuário autenticado.

---

### Tela de matches

Rota no frontend:

```txt
/matches
```

Descrição:

Tela usada para visualizar possíveis combinações de troca entre usuários.

Rota REST implementada para a avaliação:

```http
POST /api/avaliativa/trocas
```

Essa rota cria uma proposta de troca com status inicial `pending`.

Exemplo de corpo da requisição:

```json
{
  "receptorId": "id-do-usuario-receptor",
  "livrosOferecidos": ["id-do-livro-oferecido"],
  "livrosSolicitados": ["id-do-livro-solicitado"]
}
```

---

### Tela de trocas

Rota no frontend:

```txt
/trades
```

Descrição:

Tela usada para acompanhar propostas de troca e aceitar trocas recebidas.

Rota REST implementada para a avaliação:

```http
POST /api/avaliativa/trocas/:id/aceitar
```

Essa rota aceita uma troca pendente e transfere os livros entre os usuários.

---

## Rotas REST implementadas

| Método | Rota                                 | Descrição                                    |
| ------ | ------------------------------------ | -------------------------------------------- |
| POST   | `/api/avaliativa/usuarios`           | Cadastra um novo usuário                     |
| POST   | `/api/avaliativa/login`              | Autentica um usuário                         |
| GET    | `/api/avaliativa/usuarios/:id`       | Busca o perfil de um usuário e seus livros   |
| POST   | `/api/avaliativa/livros`             | Cadastra um livro para o usuário autenticado |
| GET    | `/api/avaliativa/livros/disponiveis` | Lista livros disponíveis para troca          |
| POST   | `/api/avaliativa/trocas`             | Cria uma proposta de troca                   |
| POST   | `/api/avaliativa/trocas/:id/aceitar` | Aceita uma troca e transfere os livros       |

---

## Relação com os diagramas

As rotas REST implementadas seguem os fluxos definidos nos diagramas de sequência e classes das etapas anteriores:

* Cadastro de usuário: criação de usuário com nome, email, senha e identificação.
* Cadastro de livro: criação de livro vinculado a um dono e disponível para troca.
* Proposta de troca: criação de troca com status pendente.
* Aceite da troca: alteração do status da troca e transferência dos livros entre os usuários.

---

## Como testar a aplicação

### Teste pelo navegador

Acesse:

```txt
https://animated-space-eureka-5656qqggwxpfv5gg-3000.app.github.dev
```

Fluxo recomendado:

1. Abrir a tela de cadastro.
2. Criar um usuário.
3. Fazer login.
4. Acessar as telas de livros, matches e trocas.

---

## Como rodar localmente

## Pré-requisitos

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v14 or higher)
- **Redis** (optional, for caching)

Na raiz do projeto:

```bash
docker compose up -d postgres redis
```

### Backend

```bash
cd packages/backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Frontend

```bash
cd packages/frontend
npm install
npm run dev
```

---

## Variáveis de ambiente

### Backend

Arquivo:

```txt
packages/backend/.env
```

Exemplo:

```env
DATABASE_URL="postgresql://bookswap:bookswap_dev_password@127.0.0.1:5433/bookswap?schema=public"
JWT_SECRET="segredo-da-atividade"
PORT=5000
REDIS_URL="redis://127.0.0.1:6379"
FRONTEND_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3000"
```

### Frontend

Arquivo:

```txt
packages/frontend/.env
```

Exemplo local:

```env
VITE_API_URL=http://localhost:5000
```

Exemplo no Codespaces:

```env
VITE_API_URL=https://animated-space-eureka-5656qqggwxpfv5gg-5000.app.github.dev
```

---

## Tecnologias utilizadas

* React
* Vite
* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* Redis
* Docker
* GitHub Codespaces
