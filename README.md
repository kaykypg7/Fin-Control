# Gastos App

Aplicação de controle de gastos pessoais com tela de administração, responsiva para desktop
(sidebar) e mobile (bottom navigation).

## Funcionalidades

- Cadastro de renda mensal e metas de gasto por categoria
- Alerta reativo (client-side, sem chamada de rede) quando a soma das metas ultrapassa o salário
- Recomendação automática de metas pela regra **50/30/20** (Necessidade/Desejo/Poupança),
  proporcional ao histórico de gastos dos últimos 3 meses
- Indicador visual de progresso por categoria (verde &lt;80%, amarelo 80–100%, vermelho &gt;100%)
- Lançamento e listagem de gastos, com filtro por mês/categoria
- Dashboard com gráficos (pizza de metas, barras meta x gasto real)
- Relatórios: comparativo mensal e evolução de gastos por categoria
- Tela de administração: usuários (somente contagens agregadas — nunca dados financeiros
  individuais de terceiros), categorias padrão do sistema, métricas de uso
- Tema claro/escuro e edição de perfil

## Stack

- **Backend**: Java 21, Spring Boot 3.3, Spring Data JPA, Spring Security + JWT, Bean
  Validation, Flyway, PostgreSQL (produção) / H2 (dev), Lombok
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, React Query, Recharts, React Router

## Estrutura

```
gastos-app/
  backend/    # API Spring Boot
  frontend/   # SPA React
  docker-compose.yml   # Postgres para desenvolvimento
```

## Pré-requisitos

- Java 21+ e Maven 3.9+ instalados e no PATH (`java -version`, `mvn -version`)
- Node.js 20+ e npm
- Docker Desktop (opcional — só necessário para rodar contra Postgres real em vez de H2)

## Rodando localmente

### Backend

Duas formas de rodar, dependendo se você quer usar H2 (em memória, sem dependências) ou
Postgres real via Docker:

**Opção A — perfil `dev`, com H2 (mais rápido para desenvolver, sem Docker):**

```
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Opção B — perfil default, com Postgres via Docker:**

```
docker compose up -d postgres
cd backend
mvn spring-boot:run
```

Ambas as opções foram validadas ponta a ponta (registro, categorias, salário, recomendação
50/30/20, lançamentos, relatórios) — a Opção B foi confirmada contra PostgreSQL 16 real via
Docker Compose depois de habilitar a virtualização (VT-x/AMD-V) nesta máquina.

O backend sobe em `http://localhost:8080`. As migrations do Flyway (schema + seed de 8
categorias padrão) rodam automaticamente no boot em ambas as opções.

### Testes do backend

```
cd backend
mvn test
```

19 testes (JUnit 5 + Mockito + AssertJ), cobrindo principalmente a regra 50/30/20
(`BudgetRecommendationServiceTest`, com todos os casos-limite: sem histórico, histórico
zerado, categoria única, grupo vazio, sem salário, arredondamento) e o isolamento de dados
entre usuários (`CategoryServiceTest`, `AdminControllerIntegrationTest`).

### Frontend

```
cd frontend
npm install
npm run dev
```

O frontend sobe em `http://localhost:5173` e espera a API em `http://localhost:8080/api`
(configurável via `frontend/.env.development`, chave `VITE_API_URL`).

### Testes do frontend

```
cd frontend
npm test
```

13 testes (Vitest + Testing Library), cobrindo o cálculo do excedente de metas
(`budgetMath.test.ts`), o hook reativo do banner (`useBudgetAlert.test.ts`) e a renderização
condicional do banner (`BudgetAlertBanner.test.tsx`).

## Primeiro uso

1. Acesse `http://localhost:5173`, clique em "Cadastre-se" e crie uma conta
2. Informe seu salário mensal (onboarding)
3. Em **Categorias e Metas**, defina as metas por categoria manualmente ou clique em
   "Aplicar recomendação 50/30/20" para uma sugestão automática — os valores continuam
   editáveis antes de salvar
4. Registre seus gastos em **Lançamentos**
5. Acompanhe o resumo no **Dashboard** e o histórico em **Relatórios**

Para acessar a tela de **Admin**, o usuário precisa ter `role = ADMIN` — não há
auto-promoção via UI (por design, para não permitir escalação de privilégio). Promova um
usuário manualmente atualizando a coluna `role` na tabela `users` do banco.

## API

Autenticação via `Authorization: Bearer <token>`, obtido em `/api/auth/login` ou
`/api/auth/register`.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cadastro (sempre cria role USER) |
| POST | `/api/auth/login` | Login |
| GET/PUT | `/api/users/me` | Perfil do usuário autenticado |
| GET | `/api/salary/current` | Salário do mês corrente |
| POST | `/api/salary` | Cria/atualiza salário de um mês |
| GET | `/api/categories` | Categorias do sistema + próprias |
| POST | `/api/categories` | Cria categoria própria |
| PUT/DELETE | `/api/categories/{id}` | Edita/remove categoria própria (403 em categoria do sistema ou de outro usuário) |
| GET | `/api/budgets?month=YYYY-MM` | Metas do mês |
| POST | `/api/budgets` | Salva metas do mês (bulk upsert) |
| POST | `/api/budgets/recommend?month=YYYY-MM` | Sugestão 50/30/20 |
| GET | `/api/transactions?month=YYYY-MM&categoryId=` | Lançamentos (filtro opcional por categoria) |
| POST/PUT/DELETE | `/api/transactions/{id}` | CRUD de lançamentos |
| GET | `/api/reports/summary?month=YYYY-MM` | Resumo do mês (metas x gastos por categoria) |
| GET | `/api/reports/monthly-comparison?months=6` | Comparativo entre meses |
| GET | `/api/reports/category-evolution?months=6&categoryId=` | Evolução de gasto por categoria |
| GET | `/api/admin/users` \| `/categories` \| `/metrics` | Somente ADMIN — nunca expõe dados financeiros individuais de outro usuário |

## Decisões de design

**`budgets` e `transactions` têm `user_id`** (além de `category_id`), diferente do modelo
sugerido originalmente. Como `categories.user_id` pode ser nulo (categoria padrão do
sistema, compartilhada entre usuários), uma meta/gasto amarrado só à categoria não teria
como distinguir os dados de um usuário dos de outro quando ambos usam a mesma categoria
padrão.

**O alerta de estouro de metas é calculado inteiramente no frontend**, sem chamada de rede,
porque precisa reagir a valores ainda não salvos (a cada tecla). O backend não bloqueia nem
valida a soma das metas contra o salário — só expõe os dados (`/reports/summary`) que o
frontend usa para o estado inicial do formulário.

**Sem Lombok em versões antigas**: o projeto usa Lombok 1.18.46 com
`annotationProcessorPaths` explícito no `maven-compiler-plugin`, necessário porque a
descoberta automática do processor não funcionou nesta combinação de JDK 23 + Maven
(mesmo com a versão do Lombok compatível) — sem essa configuração explícita, os métodos
gerados pelo Lombok silenciosamente não eram criados.
