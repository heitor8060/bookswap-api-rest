# BookSwap - API REST

Projeto desenvolvido para a disciplina de **Engenharia de Software 2**.

## Componentes do grupo

- Luiz Gustavo Nicacio
- Heitor dos Passos Pinho

---

## Links para teste funcional

Repositório GitHub:  
https://github.com/heitor8060/bookswap-api-rest

Aplicação funcionando via Render:  
https://bookswap-api-rest.onrender.com/login

Tela avaliativa:  
https://bookswap-api-rest.onrender.com/avaliativa

---

## Descrição do projeto

O **BookSwap** é uma aplicação web para troca de livros entre usuários.

O sistema permite que usuários se cadastrem, façam login, cadastrem livros, visualizem livros disponíveis, encontrem possíveis trocas, conversem com outros usuários, proponham trocas e aceitem propostas.

A API REST foi implementada no backend utilizando **Node.js**, **Express**, **TypeScript**, **Prisma ORM** e **PostgreSQL**.

O sistema completo possui várias rotas REST. Para a atividade avaliativa, foram destacadas as rotas relacionadas diretamente aos diagramas de classe e sequência produzidos nas etapas anteriores.

Os diagramas da atividade trabalham principalmente com as entidades:

- **Usuário**
- **Livro**
- **Troca**

Por isso, a parte principal da avaliativa destaca os fluxos de:

- Cadastro de usuário;
- Login de usuário;
- Consulta de usuário;
- Cadastro de livro;
- Listagem de livros disponíveis;
- Criação de proposta de troca;
- Aceite de troca.

---

## Implementação da API REST

A API REST foi implementada com **Express**, usando rotas separadas por responsabilidade.

No backend, as rotas são registradas com os seguintes prefixos:

```txt
/api/auth
/api/profile
/api/books
/api/matches
/api/chats
/api/chat-requests
/api/rooms
/api/proposals
/api/trades
/api/users
/api/avaliativa
```

Além dessas rotas, também existe a rota:

```txt
/health
```

A rota `/health` é usada para verificar se o servidor está funcionando.

---

## API REST da avaliativa

A API REST específica da avaliativa foi organizada no backend com o prefixo:

```txt
/api/avaliativa
```

Essas rotas foram criadas para representar, de forma prática, os fluxos definidos nos diagramas de classe e sequência da atividade.

---

## Rotas REST implementadas para a avaliativa

| Método | Rota | Entidade principal | Relação com os diagramas | Descrição |
|---|---|---|---|---|
| POST | `/api/avaliativa/usuarios` | Usuário | Diagrama de classes e diagrama sequencial de cadastro de usuário | Cadastra um novo usuário |
| POST | `/api/avaliativa/login` | Usuário | Fluxo complementar para autenticação do usuário | Autentica um usuário cadastrado |
| GET | `/api/avaliativa/usuarios/:id` | Usuário / Livro | Relação entre Usuário e Livro no diagrama de classes | Busca um usuário e seus livros cadastrados |
| POST | `/api/avaliativa/livros` | Livro | Diagrama sequencial de cadastro de livro | Cadastra um livro para o usuário autenticado |
| GET | `/api/avaliativa/livros/disponiveis` | Livro / Troca | Relação entre Livro e Troca | Lista livros disponíveis para troca |
| POST | `/api/avaliativa/trocas` | Troca | Diagrama sequencial de proposta de troca | Cria uma proposta de troca entre usuários |
| POST | `/api/avaliativa/trocas/:id/aceitar` | Troca | Fluxo complementar de finalização da troca | Aceita uma troca e transfere os livros entre os usuários |

---

## Implementações da API REST da avaliativa

### 1. Cadastro de usuário

Rota:

```http
POST /api/avaliativa/usuarios
```

Descrição:

Implementa o cadastro de um novo usuário no sistema.

Essa rota está relacionada ao diagrama de classes, pois utiliza a entidade **Usuário**, representada com atributos como `id`, `nome` e `email`.

Também está relacionada ao diagrama sequencial de cadastro/login, no qual o `FrontEnd` envia uma requisição `post("/usuario", req)` para a rota, que chama o controller responsável por salvar o usuário.

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

### 2. Login de usuário

Rota:

```http
POST /api/avaliativa/login
```

Descrição:

Implementa a autenticação de um usuário cadastrado.

Embora o login seja um fluxo complementar, ele é necessário para testar as rotas protegidas da avaliativa, como cadastro de livros, listagem de livros disponíveis e criação de trocas.

Exemplo de corpo da requisição:

```json
{
  "email": "heitor@email.com",
  "senha": "123456"
}
```

---

### 3. Consulta de usuário

Rota:

```http
GET /api/avaliativa/usuarios/:id
```

Descrição:

Busca os dados de um usuário pelo ID e retorna também seus livros cadastrados.

Essa rota está relacionada ao diagrama de classes, pois representa a associação entre **Usuário** e **Livro**.

No diagrama, um usuário pode possuir vários livros, então essa rota permite visualizar essa relação na prática.

Requer autenticação via token JWT.

---

### 4. Cadastro de livro

Rota:

```http
POST /api/avaliativa/livros
```

Descrição:

Implementa o cadastro de um livro para o usuário autenticado.

Essa rota está relacionada ao diagrama de classes, pois utiliza a entidade **Livro**, representada com atributos como `id`, `titulo` e `disponivel`.

Também está relacionada ao diagrama sequencial da tela de adicionar livros, no qual o `FrontEnd` envia uma requisição `post("/livro", req)`, o controller define os dados do livro e salva a informação na camada de persistência.

Requer autenticação via token JWT.

Exemplo de corpo da requisição:

```json
{
  "titulo": "Dom Casmurro",
  "autor": "Machado de Assis",
  "condicao": "usado",
  "description": "Livro em bom estado"
}
```

---

### 5. Listagem de livros disponíveis

Rota:

```http
GET /api/avaliativa/livros/disponiveis
```

Descrição:

Lista os livros cadastrados no sistema que estão disponíveis para troca.

Essa rota está relacionada à entidade **Livro** e também ao fluxo de **Troca**, pois permite que um usuário veja quais livros podem ser solicitados em uma proposta.

Requer autenticação via token JWT.

---

### 6. Criação de proposta de troca

Rota:

```http
POST /api/avaliativa/trocas
```

Descrição:

Cria uma proposta de troca entre dois usuários.

Essa rota está diretamente relacionada ao diagrama de classes, pois utiliza a entidade **Troca**, que possui atributos como `id` e `status`, além de se relacionar com **Usuário** e **Livro**.

Também está relacionada ao diagrama sequencial da tela de propor troca, no qual o `FrontEnd` envia uma requisição `post("/troca", req)`, o controller define o status da troca como pendente, associa o proponente e marca o livro como indisponível.

Requer autenticação via token JWT.

Exemplo de corpo da requisição:

```json
{
  "receptorId": "id-do-usuario-receptor",
  "livrosOferecidosIds": ["id-do-livro-oferecido"],
  "livrosSolicitadosIds": ["id-do-livro-solicitado"]
}
```

---

### 7. Aceite de troca

Rota:

```http
POST /api/avaliativa/trocas/:id/aceitar
```

Descrição:

Aceita uma proposta de troca pendente.

Essa rota é complementar ao fluxo de troca. Ela finaliza a proposta, altera o status da troca para aceita e transfere os livros entre os usuários envolvidos.

Requer autenticação via token JWT.

---

## Relação com o diagrama de classes

O diagrama de classes da atividade apresenta a estrutura principal do sistema BookSwap, com separação em camadas como:

- **Routes**
- **DTO**
- **Controller**
- **Model**
- **Persistence Layer**

As principais classes e interfaces relacionadas à API REST são:

### Usuário

Representado pela classe **Usuario**, com atributos como:

- `id`
- `nome`
- `email`

E métodos como:

- `setId()`
- `getId()`
- `setNome()`
- `getNome()`
- `setEmail()`
- `getEmail()`
- `addLivro()`
- `getLivros()`

Rotas relacionadas:

```http
POST /api/avaliativa/usuarios
POST /api/avaliativa/login
GET /api/avaliativa/usuarios/:id
```

---

### Livro

Representado pela classe **Livro**, com atributos como:

- `id`
- `titulo`
- `disponivel`

E métodos como:

- `setId()`
- `setTitulo()`
- `setDisponivel()`
- `setDono()`

Rotas relacionadas:

```http
POST /api/avaliativa/livros
GET /api/avaliativa/livros/disponiveis
GET /api/avaliativa/usuarios/:id
```

---

### Troca

Representada pela classe **Troca**, com atributos como:

- `id`
- `status`

E métodos como:

- `setId()`
- `setStatus()`
- `setProponente()`
- `addLivroOferecido()`

Rotas relacionadas:

```http
POST /api/avaliativa/trocas
POST /api/avaliativa/trocas/:id/aceitar
GET /api/avaliativa/livros/disponiveis
```

---

### Relações entre as classes

O diagrama de classes representa as seguintes relações:

| Relação | Significado no sistema | Rotas relacionadas |
|---|---|---|
| Usuário 1 para 0..* Livro | Um usuário pode cadastrar vários livros | `POST /api/avaliativa/livros`, `GET /api/avaliativa/usuarios/:id` |
| Usuário 1 para 0..* Troca | Um usuário pode participar de várias trocas | `POST /api/avaliativa/trocas` |
| Troca 0..* para 1..* Livro | Uma troca envolve um ou mais livros | `POST /api/avaliativa/trocas`, `POST /api/avaliativa/trocas/:id/aceitar` |

---

## Relação com os diagramas sequenciais

Os diagramas sequenciais mostram o fluxo de comunicação entre:

- **FrontEnd**
- **Route**
- **Controller**
- **DAO / Persistence Layer**
- **Entidades do Model**

As rotas REST implementadas seguem esses fluxos.

---

### Diagrama sequencial: cadastro de usuário

Fluxo representado no PDF:

```txt
FrontEnd -> route : post("/usuario", req)
route -> ctrl : salvar(req, res)
ctrl -> usuario : setNome(req.nome)
ctrl -> usuario : setEmail(req.email)
ctrl -> usuario : setId(req)
ctrl -> dao : salvar(usuario)
dao --> ctrl : boolean
ctrl --> route : boolean
route --> FrontEnd : res
```

Implementação REST correspondente:

```http
POST /api/avaliativa/usuarios
```

Rota complementar para autenticação:

```http
POST /api/avaliativa/login
```

---

### Diagrama sequencial: cadastro de livro

Fluxo representado no PDF:

```txt
FrontEnd -> route : post("/livro", req)
route -> ctrl : salvar(req, res)
ctrl -> livro : setTitulo(req.titulo)
ctrl -> livro : setDisponivel(true)
ctrl -> livro : setDono(req.dono)
ctrl -> livro : setId(req)
ctrl -> dao : salvar(livro)
dao --> ctrl : boolean
ctrl --> route : boolean
route --> FrontEnd : res
```

Implementação REST correspondente:

```http
POST /api/avaliativa/livros
```

Rota complementar relacionada:

```http
GET /api/avaliativa/livros/disponiveis
```

---

### Diagrama sequencial: proposta de troca

Fluxo representado no PDF:

```txt
FrontEnd -> route : post("/troca", req)
route -> ctrl : salvar(req, res)
ctrl -> troca : setStatus("PENDENTE")
ctrl -> troca : setProponente(req.proponente)
ctrl -> livro : setDisponivel(false)
ctrl -> troca : addLivroOferecido(livro)
ctrl -> troca : setId(req)
ctrl -> dao : salvar(troca)
dao --> ctrl : boolean
ctrl --> route : boolean
route --> FrontEnd : res
```

Implementação REST correspondente:

```http
POST /api/avaliativa/trocas
```

Rota complementar para conclusão do fluxo:

```http
POST /api/avaliativa/trocas/:id/aceitar
```

---

## Outras APIs REST implementadas no sistema completo

Além das 7 rotas da avaliativa, o backend possui outras rotas REST que fazem parte do funcionamento completo da aplicação BookSwap.

Essas rotas não são o foco principal dos diagramas da avaliativa, mas também são APIs REST porque usam métodos HTTP como `GET`, `POST`, `PUT`, `PATCH` e `DELETE`.

---

### Verificação do servidor

| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Verifica se o servidor está funcionando |

---

### Autenticação — `/api/auth`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cadastra um novo usuário no sistema completo |
| POST | `/api/auth/login` | Autentica um usuário no sistema completo |
| POST | `/api/auth/logout` | Encerra a sessão do usuário autenticado |
| POST | `/api/auth/password-reset` | Solicita redefinição de senha |
| PUT | `/api/auth/password-reset` | Confirma a redefinição de senha |

---

### Perfil — `/api/profile`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/profile` | Busca o perfil do usuário autenticado |
| PUT | `/api/profile` | Atualiza dados do perfil do usuário |
| POST | `/api/profile/picture` | Faz upload da foto de perfil |
| GET | `/api/profile/ratings` | Lista as avaliações recebidas pelo usuário |

---

### Livros — `/api/books`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/books` | Lista os livros do usuário autenticado |
| GET | `/api/books/:id` | Busca um livro pelo ID |
| POST | `/api/books/inventory` | Adiciona um livro ao inventário |
| POST | `/api/books/wishlist` | Adiciona um livro à lista de desejos |
| DELETE | `/api/books/inventory/:id` | Remove um livro do inventário |
| DELETE | `/api/books/wishlist/:id` | Remove um livro da lista de desejos |
| PATCH | `/api/books/inventory/:id/availability` | Atualiza a disponibilidade de um livro |
| PATCH | `/api/books/inventory/:id` | Atualiza dados de um livro do inventário |
| PATCH | `/api/books/wishlist/:id` | Atualiza dados de um livro da lista de desejos |

---

### Matches — `/api/matches`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/matches` | Lista os matches do usuário |
| POST | `/api/matches/refresh` | Recalcula os matches do usuário |
| DELETE | `/api/matches/:matchId` | Oculta um match específico |
| DELETE | `/api/matches` | Oculta todos os matches do usuário |
| GET | `/api/matches/book/:bookId` | Lista matches relacionados a um livro específico |

---

### Chats — `/api/chats`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/chats/status/:matchedUserId` | Verifica o status do chat com outro usuário |
| GET | `/api/chats` | Lista os chats do usuário |
| POST | `/api/chats` | Cria um chat com base em um match |
| GET | `/api/chats/:chatId/messages` | Lista mensagens de um chat |
| POST | `/api/chats/:chatId/messages` | Envia uma mensagem em um chat |
| POST | `/api/chats/:chatId/close` | Fecha um chat |

---

### Solicitações de chat — `/api/chat-requests`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/chat-requests` | Cria uma solicitação de chat |
| POST | `/api/chat-requests/:id/reject` | Rejeita uma solicitação de chat |
| POST | `/api/chat-requests/:id/accept` | Aceita uma solicitação de chat |
| GET | `/api/chat-requests` | Lista solicitações de chat enviadas e recebidas |

---

### Salas — `/api/rooms`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/rooms` | Lista salas da localização do usuário |
| POST | `/api/rooms/init-location` | Inicializa salas da localização do usuário |
| POST | `/api/rooms/:roomId/join` | Entra em uma sala |
| GET | `/api/rooms/:roomId/messages` | Lista mensagens de uma sala |
| POST | `/api/rooms/private` | Cria uma sala privada ou personalizada |
| GET | `/api/rooms/search` | Pesquisa salas |
| POST | `/api/rooms/:roomId/request` | Solicita entrada em uma sala privada |
| POST | `/api/rooms/:roomId/approve/:userId` | Aprova solicitação de entrada em sala |
| POST | `/api/rooms/:roomId/deny/:userId` | Recusa solicitação de entrada em sala |
| GET | `/api/rooms/:roomId/requests` | Lista solicitações pendentes de uma sala |
| DELETE | `/api/rooms/:roomId/members/:userId` | Remove um membro de uma sala |
| PATCH | `/api/rooms/:roomId/visibility` | Altera a visibilidade de uma sala |
| GET | `/api/rooms/:roomId/details` | Busca detalhes de uma sala |
| GET | `/api/rooms/:roomId/members` | Lista membros de uma sala |
| POST | `/api/rooms/:id/leave` | Sai de uma sala |

---

### Propostas de encontro — `/api/proposals`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/proposals/chat/:chatId` | Lista propostas de encontro de um chat |
| POST | `/api/proposals` | Cria uma proposta de encontro |
| POST | `/api/proposals/:id/accept` | Aceita uma proposta de encontro |
| POST | `/api/proposals/:id/reject` | Rejeita uma proposta de encontro |
| PUT | `/api/proposals/:id` | Atualiza uma proposta de encontro |

---

### Trocas — `/api/trades`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/trades` | Cria uma proposta de troca |
| GET | `/api/trades` | Lista as trocas do usuário |
| POST | `/api/trades/:id/confirm` | Confirma uma troca |
| POST | `/api/trades/:id/rate` | Avalia um usuário após uma troca |
| DELETE | `/api/trades/:id` | Cancela uma troca |
| POST | `/api/trades/report` | Reporta um usuário |
| POST | `/api/trades/:id/accept` | Aceita uma proposta de troca |
| POST | `/api/trades/:id/reject` | Rejeita uma proposta de troca |
| POST | `/api/trades/:id/counter` | Cria uma contraproposta de troca |
| POST | `/api/trades/:id/extend-lock` | Estende o bloqueio dos livros da troca |
| GET | `/api/trades/:id/locks` | Lista bloqueios de livros de uma troca |
| GET | `/api/trades/interests/my-books` | Lista interesses concorrentes nos livros do usuário |

---

### Usuários — `/api/users`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/users/search` | Pesquisa usuários |
| GET | `/api/users/:userId` | Busca o perfil público de um usuário |
| GET | `/api/users/:userId/books` | Lista todos os livros de um usuário |
| GET | `/api/users/:userId/inventory` | Lista o inventário de um usuário |
| GET | `/api/users/:userId/wishlist` | Lista a lista de desejos de um usuário |
| GET | `/api/users/:userId/ratings` | Lista avaliações de um usuário |
| GET | `/api/users/:id/summary` | Busca um resumo do perfil de um usuário |

---

## Resumo da quantidade de rotas

| Grupo | Quantidade |
|---|---:|
| `/health` | 1 |
| `/api/auth` | 5 |
| `/api/profile` | 4 |
| `/api/books` | 9 |
| `/api/matches` | 5 |
| `/api/chats` | 6 |
| `/api/chat-requests` | 4 |
| `/api/rooms` | 15 |
| `/api/proposals` | 5 |
| `/api/trades` | 12 |
| `/api/users` | 7 |
| `/api/avaliativa` | 7 |
| **Total de rotas REST da API** | **80** |

Das 80 rotas listadas, **7 rotas** são destacadas como rotas específicas da atividade avaliativa, pois estão diretamente relacionadas aos diagramas de classe e sequência dos PDFs.

---

## Telas da aplicação e rotas relacionadas

### Tela de cadastro

Rota no frontend:

```txt
/register
```

Descrição:

Tela usada para cadastrar um novo usuário no sistema.

Rota REST do sistema completo:

```http
POST /api/auth/register
```

Rota REST da avaliativa:

```http
POST /api/avaliativa/usuarios
```

---

### Tela de login

Rota no frontend:

```txt
/login
```

Descrição:

Tela usada para autenticar um usuário cadastrado.

Rota REST do sistema completo:

```http
POST /api/auth/login
```

Rota REST da avaliativa:

```http
POST /api/avaliativa/login
```

---

### Tela inicial / perfil do usuário

Rota no frontend:

```txt
/
```

Descrição:

Tela acessada após o login, usada para visualizar informações do usuário.

Rotas REST relacionadas no sistema completo:

```http
GET /api/profile
PUT /api/profile
GET /api/users/:id/summary
```

Rota REST da avaliativa:

```http
GET /api/avaliativa/usuarios/:id
```

---

### Tela de livros

Rota no frontend:

```txt
/books
```

Descrição:

Tela usada para visualizar, cadastrar, editar e remover livros do usuário.

Rotas REST relacionadas no sistema completo:

```http
GET /api/books
GET /api/books/:id
POST /api/books/inventory
POST /api/books/wishlist
DELETE /api/books/inventory/:id
DELETE /api/books/wishlist/:id
PATCH /api/books/inventory/:id/availability
PATCH /api/books/inventory/:id
PATCH /api/books/wishlist/:id
```

Rotas REST da avaliativa:

```http
POST /api/avaliativa/livros
GET /api/avaliativa/livros/disponiveis
```

---

### Tela de matches

Rota no frontend:

```txt
/matches
```

Descrição:

Tela usada para visualizar possíveis combinações de troca entre usuários.

Rotas REST relacionadas no sistema completo:

```http
GET /api/matches
POST /api/matches/refresh
DELETE /api/matches/:matchId
DELETE /api/matches
GET /api/matches/book/:bookId
```

Rota REST da avaliativa relacionada à proposta de troca:

```http
POST /api/avaliativa/trocas
```

---

### Tela de chats

Rota relacionada:

```txt
/chats
```

Descrição:

Tela usada para conversar com outros usuários após match ou solicitação aceita.

Rotas REST relacionadas no sistema completo:

```http
GET /api/chats/status/:matchedUserId
GET /api/chats
POST /api/chats
GET /api/chats/:chatId/messages
POST /api/chats/:chatId/messages
POST /api/chats/:chatId/close
```

---

### Tela de solicitações de chat

Descrição:

Fluxo usado para solicitar, aceitar ou recusar início de conversa com outro usuário.

Rotas REST relacionadas no sistema completo:

```http
POST /api/chat-requests
POST /api/chat-requests/:id/reject
POST /api/chat-requests/:id/accept
GET /api/chat-requests
```

---

### Tela de salas

Rota relacionada:

```txt
/rooms
```

Descrição:

Tela usada para interação em salas públicas, privadas ou por localização.

Rotas REST relacionadas no sistema completo:

```http
GET /api/rooms
POST /api/rooms/init-location
POST /api/rooms/:roomId/join
GET /api/rooms/:roomId/messages
POST /api/rooms/private
GET /api/rooms/search
POST /api/rooms/:roomId/request
POST /api/rooms/:roomId/approve/:userId
POST /api/rooms/:roomId/deny/:userId
GET /api/rooms/:roomId/requests
DELETE /api/rooms/:roomId/members/:userId
PATCH /api/rooms/:roomId/visibility
GET /api/rooms/:roomId/details
GET /api/rooms/:roomId/members
POST /api/rooms/:id/leave
```

---

### Tela de propostas de encontro

Descrição:

Fluxo usado para propor, aceitar, recusar ou atualizar encontros relacionados a chats.

Rotas REST relacionadas no sistema completo:

```http
GET /api/proposals/chat/:chatId
POST /api/proposals
POST /api/proposals/:id/accept
POST /api/proposals/:id/reject
PUT /api/proposals/:id
```

---

### Tela de trocas

Rota no frontend:

```txt
/trades
```

Descrição:

Tela usada para acompanhar propostas de troca, aceitar, recusar, confirmar, avaliar ou cancelar trocas.

Rotas REST relacionadas no sistema completo:

```http
POST /api/trades
GET /api/trades
POST /api/trades/:id/confirm
POST /api/trades/:id/rate
DELETE /api/trades/:id
POST /api/trades/report
POST /api/trades/:id/accept
POST /api/trades/:id/reject
POST /api/trades/:id/counter
POST /api/trades/:id/extend-lock
GET /api/trades/:id/locks
GET /api/trades/interests/my-books
```

Rota REST da avaliativa:

```http
POST /api/avaliativa/trocas/:id/aceitar
```

---

### Tela de usuários

Rota no frontend:

```txt
/users
```

Descrição:

Tela usada para pesquisar usuários e visualizar perfis públicos.

Rotas REST relacionadas no sistema completo:

```http
GET /api/users/search
GET /api/users/:userId
GET /api/users/:userId/books
GET /api/users/:userId/inventory
GET /api/users/:userId/wishlist
GET /api/users/:userId/ratings
GET /api/users/:id/summary
```

---

## Rotas da aplicação

Cadastro:  
https://bookswap-api-rest.onrender.com/register

Login:  
https://bookswap-api-rest.onrender.com/login

Página inicial:  
https://bookswap-api-rest.onrender.com

Livros:  
https://bookswap-api-rest.onrender.com/books

Matches:  
https://bookswap-api-rest.onrender.com/matches

Trocas:  
https://bookswap-api-rest.onrender.com/trades

Usuários:  
https://bookswap-api-rest.onrender.com/users

Perfil:  
https://bookswap-api-rest.onrender.com/profile

Tela avaliativa:  
https://bookswap-api-rest.onrender.com/avaliativa

---

## Como testar a API REST da avaliativa

### 1. Criar um usuário

```http
POST /api/avaliativa/usuarios
```

Corpo:

```json
{
  "nome": "Heitor",
  "email": "heitor@email.com",
  "senha": "123456",
  "location": "Taguatinga"
}
```

---

### 2. Fazer login

```http
POST /api/avaliativa/login
```

Corpo:

```json
{
  "email": "heitor@email.com",
  "senha": "123456"
}
```

Copie o token retornado na resposta.

---

### 3. Cadastrar um livro

```http
POST /api/avaliativa/livros
Authorization: Bearer token-jwt
```

Corpo:

```json
{
  "titulo": "Dom Casmurro",
  "autor": "Machado de Assis",
  "condicao": "usado",
  "description": "Livro em bom estado"
}
```

---

### 4. Listar livros disponíveis

```http
GET /api/avaliativa/livros/disponiveis
Authorization: Bearer token-jwt
```

---

### 5. Criar uma proposta de troca

```http
POST /api/avaliativa/trocas
Authorization: Bearer token-jwt
```

Corpo:

```json
{
  "receptorId": "id-do-usuario-receptor",
  "livrosOferecidosIds": ["id-do-livro-oferecido"],
  "livrosSolicitadosIds": ["id-do-livro-solicitado"]
}
```

---

### 6. Aceitar uma troca

```http
POST /api/avaliativa/trocas/id-da-troca/aceitar
Authorization: Bearer token-jwt
```

---

## Como testar pela aplicação

Acesse:

```txt
https://bookswap-api-rest.onrender.com/avaliativa
```

Fluxo recomendado:

1. Criar um usuário.
2. Fazer login.
3. Cadastrar livros.
4. Criar outro usuário.
5. Fazer login com o segundo usuário.
6. Visualizar livros disponíveis.
7. Propor uma troca.
8. Aceitar a troca.

---

## Como rodar localmente

### Pré-requisitos

- Node.js v18 ou superior
- npm ou yarn
- PostgreSQL v14 ou superior
- Redis opcional
- Docker opcional, caso queira subir PostgreSQL e Redis via container

---

### Subir PostgreSQL e Redis com Docker

Na raiz do projeto, execute:

```bash
docker compose up -d postgres redis
```

---

### Rodar o backend

```bash
cd packages/backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

O backend será executado, por padrão, na porta:

```txt
http://localhost:5000
```

---

### Rodar o frontend

```bash
cd packages/frontend
npm install
npm run dev
```

O frontend será executado, por padrão, em:

```txt
http://localhost:5173
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
FRONTEND_URL="http://localhost:5173"
CORS_ORIGIN="http://localhost:5173"
```

---

### Frontend

Arquivo:

```txt
packages/frontend/.env
```

Exemplo local:

```env
VITE_API_URL=http://localhost:5000
```

Exemplo no GitHub Codespaces:

```env
VITE_API_URL=https://animated-space-eureka-5656qqggwxpfv5gg-5000.app.github.dev
```

---

## Tecnologias utilizadas

- React
- Vite
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- Docker
- Render
- GitHub Codespaces

---

