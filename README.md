# 🦜 SIAPESQ — API de Espécies

API REST para gerenciamento e análise de dados de espécies com integração climática automática.

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | 22+ | Runtime |
| TypeScript | 6 | Tipagem estática |
| Express | 4 | Framework HTTP |
| PostgreSQL | 15 | Banco de dados |
| Prisma | 7 | ORM |
| Jest | 30 | Testes |
| Zod | 4 | Validação de entrada |
| JWT | — | Autenticação |
| BCrypt | 6 | Hash de senhas |
| Helmet | — | Headers de segurança |

## Início Rápido

### Pré-requisitos

- Node.js 22+
- Docker e Docker Compose (para PostgreSQL)

### 1. Clone e instale

```bash
git clone https://github.com/jwaozera/desafio-2026-API-NODE.git
cd desafio-2026-API-NODE
npm install
```

### 2. Configure o ambiente

```bash
cp .env.example .env
```

Edite o `.env` se necessário. Valores padrão funcionam com o docker-compose incluso.

### 3. Suba o banco

```bash
docker-compose up -d
```

### 4. Rode as migrations

```bash
npx prisma migrate dev
```

### 5. Inicie o servidor

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

## Variáveis de Ambiente

| Variável | Obrigatória | Default | Descrição |
|---|---|---|---|
| `PORTA` | Não | `3000` | Porta do servidor |
| `DATABASE_URL` | Sim | — | URL de conexão PostgreSQL |
| `JWT_SECRETO` | Sim | — | Segredo para assinatura JWT |
| `JWT_EXPIRACAO` | Não | `24h` | Tempo de expiração do token |

## Endpoints

### Autenticação

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/auth/registrar` | Registrar novo usuário | ❌ |
| `POST` | `/auth/login` | Autenticar e obter token | ❌ |

### Espécies (todas exigem autenticação)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/especies` | Cadastrar espécie (clima automático) |
| `GET` | `/especies` | Listar com paginação e filtros |
| `GET` | `/especies/:id` | Buscar por ID |
| `PUT` | `/especies/:id` | Atualizar espécie |
| `DELETE` | `/especies/:id` | Remover espécie |
| `GET` | `/especies/estatisticas` | Quantidade por categoria |
| `GET` | `/especies/:id/clima` | Atualizar clima sob demanda |

### Filtros e Paginação (GET /especies)

| Query Param | Tipo | Default | Descrição |
|---|---|---|---|
| `categoria` | string | — | Filtrar por categoria |
| `nome` | string | — | Busca por nome comum ou científico |
| `pagina` | number | `1` | Página atual |
| `limite` | number | `20` | Itens por página (max: 100) |

**Categorias válidas:** `ave`, `peixe`, `mamifero`, `reptil`, `anfibio`, `planta`, `inseto`, `outro`

### Exemplos

**Registrar:**
```bash
curl -X POST http://localhost:3000/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome": "João", "email": "joao@email.com", "senha": "123456"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "senha": "123456"}'
```

**Cadastrar espécie:**
```bash
curl -X POST http://localhost:3000/especies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nomeComum": "Arara-azul",
    "nomeCientifico": "Anodorhynchus hyacinthinus",
    "categoria": "ave",
    "latitude": -15.78,
    "longitude": -47.93
  }'
```

**Listar aves:**
```bash
curl http://localhost:3000/especies?categoria=ave&pagina=1&limite=10 \
  -H "Authorization: Bearer <token>"
```

**Consultar clima:**
```bash
curl http://localhost:3000/especies/<id>/clima \
  -H "Authorization: Bearer <token>"
```

## Testes

```bash
# rodar todos os testes
npm test

# rodar em modo watch
npm run test:watch
```

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (hot reload) |
| `npm run build` | Compilar TypeScript |
| `npm start` | Servidor de produção (requer build) |
| `npm test` | Rodar testes |
| `npm run lint` | Verificar lint (ESLint + Prettier) |
| `npm run format` | Formatar código |

## Estrutura do Projeto

```
src/
├── __mocks__/              # mocks globais para testes
├── __tests__/              # testes da app (health, setup)
├── config/
│   └── environment.ts      # validação de variáveis de ambiente (Zod)
├── modules/
│   ├── auth/               # módulo de autenticação
│   │   ├── controllers/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── schemas/        # validação Zod
│   │   ├── services/
│   │   └── __tests__/
│   ├── climate/            # módulo de integração climática
│   │   ├── services/
│   │   ├── types/
│   │   └── __tests__/
│   └── species/            # módulo de espécies
│       ├── controllers/
│       ├── repositories/
│       ├── routes/
│       ├── schemas/
│       ├── services/
│       └── __tests__/
├── shared/
│   ├── database/
│   │   └── prismaClient.ts
│   ├── errors/
│   │   └── AppErro.ts
│   └── middlewares/
│       ├── garantirAutenticacao.ts
│       └── handleError.ts
├── app.ts                  # configuração do Express
└── server.ts               # ponto de entrada
```

## Segurança

- **Helmet** — headers HTTP seguros
- **Rate Limiting** — 100 req/15min por IP
- **BCrypt** — hash de senhas (10 salt rounds)
- **JWT** — autenticação stateless
- **Zod** — validação rigorosa de entrada
- **Body Limit** — payload máximo de 10kb
- **Mensagens genéricas** — login não revela se email existe

## Integração Climática

A API consome a [Open-Meteo](https://open-meteo.com/) para enriquecer espécies com dados climáticos:

- **Na criação:** clima é buscado automaticamente. Se a API estiver fora, a espécie é criada sem dados climáticos (graceful degradation)
- **Sob demanda:** `GET /especies/:id/clima` atualiza e retorna os dados climáticos. Retorna 503 se a API estiver indisponível

Dados retornados: temperatura (°C), umidade (%), descrição do clima em português (baseada nos códigos WMO).

## CI/CD

Pipeline GitHub Actions roda em push/PR para `main`:
- **Lint** — ESLint + Prettier
- **Testes** — Jest com mocks (sem banco)
- **Node 22 e 24**
