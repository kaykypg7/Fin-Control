# Deploy gratuito — Supabase + Render + Vercel

Este guia cobre as etapas que só você pode fazer (criar contas, conectar o GitHub, colar
variáveis de ambiente nos painéis). O código já está preparado: `backend/Dockerfile`,
`render.yaml`, `frontend/vercel.json`, e as configs de porta/CORS/banco via variáveis de
ambiente.

## 0. Pré-requisito: repositório no GitHub

1. Crie um repositório vazio em [github.com/new](https://github.com/new) (público ou
   privado, tanto faz — Render e Vercel free tier funcionam com os dois)
2. Me passe a URL (ex.: `https://github.com/seu-usuario/gastos-app.git`) para eu configurar
   o remote e fazer o push do código já commitado localmente

## 1. Banco de dados — Supabase

1. Crie uma conta em [supabase.com](https://supabase.com) e um novo projeto (escolha uma
   senha forte para o banco — anote, você vai precisar dela no passo 2)
2. No painel do projeto, vá em **Project Settings → Database → Connection string** e copie
   a **Connection pooling** string no modo **Session** (porta `5432`), formato:
   ```
   postgresql://postgres.xxxxxxxxxxxx:[SUA-SENHA]@aws-0-xxxxx.pooler.supabase.com:5432/postgres
   ```
3. Guarde três valores separados, que vai usar no passo 2 (Render):
   - **DB_URL**: `jdbc:postgresql://aws-0-xxxxx.pooler.supabase.com:5432/postgres?sslmode=require`
     (mesmo host/porta/banco da connection string, prefixado com `jdbc:` e com
     `?sslmode=require` no final — o Supabase exige SSL)
   - **DB_USERNAME**: `postgres.xxxxxxxxxxxx` (a parte entre `postgresql://` e `:`)
   - **DB_PASSWORD**: a senha que você definiu na criação do projeto

## 2. Backend — Render

1. Crie uma conta em [render.com](https://render.com) e conecte sua conta do GitHub
2. **New → Blueprint**, selecione o repositório `gastos-app` — o Render vai detectar o
   `render.yaml` na raiz automaticamente e propor o serviço `gastos-app-backend`
3. Antes de confirmar o deploy, preencha as variáveis de ambiente pedidas:
   - `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` → os três valores do Supabase (passo 1)
   - `ALLOWED_ORIGINS` → deixe em branco por enquanto, você volta aqui depois do passo 3
     com a URL do Vercel (ex.: `https://gastos-app.vercel.app`)
   - `JWT_SECRET` → já vem marcado para gerar automaticamente, não precisa mexer
4. Clique em **Apply** / **Create Web Service**. O primeiro build demora alguns minutos
   (build da imagem Docker). Quando terminar, anote a URL pública, algo como
   `https://gastos-app-backend.onrender.com`
5. Teste: `https://gastos-app-backend.onrender.com/api/ping` deve responder `{"status":"ok"}`

> **Plano free do Render**: o serviço "dorme" após ~15 min sem receber requisições, e a
> próxima requisição demora ~30-50s para acordar. Normal e aceitável para um projeto
> pessoal — não é um bug.

## 3. Frontend — Vercel

1. Crie uma conta em [vercel.com](https://vercel.com) e conecte sua conta do GitHub
2. **Add New → Project**, selecione o repositório `gastos-app`
3. Em **Root Directory**, selecione `frontend` (importante — o projeto é um monorepo)
4. O Vercel detecta automaticamente que é um projeto Vite (build command `npm run build`,
   output `dist`) — não precisa mexer nisso
5. Em **Environment Variables**, adicione:
   - `VITE_API_URL` → `https://gastos-app-backend.onrender.com/api` (a URL do Render do
     passo 2, com `/api` no final)
6. Clique em **Deploy**. Ao terminar, você recebe uma URL como
   `https://gastos-app.vercel.app`

## 4. Fechando o ciclo: atualizar o CORS no Render

Volte ao painel do Render (serviço `gastos-app-backend`) → **Environment** → edite
`ALLOWED_ORIGINS` com a URL do Vercel do passo 3:

```
https://gastos-app.vercel.app
```

Se você também quiser que os preview deployments do Vercel (URLs tipo
`gastos-app-git-branch-usuario.vercel.app`) funcionem, use um padrão com curinga,
separado por vírgula:

```
https://gastos-app.vercel.app,https://*.vercel.app
```

Salvar a variável já dispara um redeploy automático do backend.

## 5. Teste final

Acesse a URL do Vercel, crie uma conta, defina seu salário e confirme que categorias,
metas, lançamentos e relatórios funcionam ponta a ponta contra o backend no Render e o
banco no Supabase.

## Custos

Todos os três serviços têm free tier permanente (sem cartão de crédito exigido para o
tier gratuito, sem expiração de banco como acontece no Postgres free do próprio Render):

| Serviço | Limite free tier |
|---|---|
| Supabase | 500MB de banco, projeto pausa após 1 semana sem uso (reativa automaticamente no primeiro acesso) |
| Render | 750h/mês de compute, dorme após 15min de inatividade |
| Vercel | 100GB de banda/mês, builds ilimitados para uso pessoal |

Suficiente e sobrando para um projeto pessoal de controle de gastos.
