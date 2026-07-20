# Deploy gratuito — Supabase + Google Cloud Run + Vercel

Este guia cobre as etapas que só você pode fazer (criar contas, conectar o GitHub, colar
variáveis de ambiente nos painéis). O código já está preparado: `backend/Dockerfile`
(já lê a porta via a variável `PORT`, que é exatamente como o Cloud Run injeta a porta),
`frontend/vercel.json`, e as configs de CORS/banco via variáveis de ambiente.

## 0. Pré-requisito: repositório no GitHub

Já feito — código publicado em [github.com/kaykypg7/Fin-Control](https://github.com/kaykypg7/Fin-Control).

## 1. Banco de dados — Supabase

1. Crie uma conta em [supabase.com](https://supabase.com) e um novo projeto (defina uma
   senha forte para o banco — se você já colou uma senha em algum chat/lugar inseguro,
   troque-a em Project Settings → Database → "Reset database password" antes de seguir)
2. No painel do projeto, vá em **Project Settings → Database → Connection string** e copie
   a **Connection pooling** string no modo **Session** (porta `5432` — não a `6543`,
   nem a conexão direta `db.xxx.supabase.co`, que é IPv6-only e não funciona a partir da
   maioria das plataformas de deploy). Formato:
   ```
   postgresql://postgres.xxxxxxxxxxxx:[SUA-SENHA]@aws-0-xxxxx.pooler.supabase.com:5432/postgres
   ```
3. Guarde três valores separados, que você vai usar no passo 2 (Cloud Run):
   - **DB_URL**: `jdbc:postgresql://aws-0-xxxxx.pooler.supabase.com:5432/postgres?sslmode=require`
     (mesmo host/porta/banco da connection string, prefixado com `jdbc:` e com
     `?sslmode=require` no final — o Supabase exige SSL)
   - **DB_USERNAME**: `postgres.xxxxxxxxxxxx` (a parte entre `postgresql://` e `:`, com
     o ponto e o ref do projeto — não é só `postgres`)
   - **DB_PASSWORD**: a senha do banco

## 2. Backend — Google Cloud Run

1. Crie uma conta em [console.cloud.google.com](https://console.cloud.google.com) (pede
   cartão de crédito para verificação — não cobra dentro do free tier, que é permanente,
   não expira em 12 meses)
2. Crie um projeto novo no console (canto superior, "Select a project → New Project")
3. Instale a CLI `gcloud`: [cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
4. No terminal, autentique e selecione o projeto:
   ```
   gcloud auth login
   gcloud config set project SEU-PROJECT-ID
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com
   ```
5. Na pasta raiz do repositório (`Fin-Control/`), rode o deploy — o Cloud Run builda o
   `backend/Dockerfile` automaticamente via Cloud Build e sobe o serviço:
   ```
   gcloud run deploy gastos-app-backend --source ./backend --region southamerica-east1 --allow-unauthenticated
   ```
   Na primeira vez ele pergunta se pode criar um Artifact Registry — responda "Y". O
   build demora alguns minutos.
6. Ao terminar, ele imprime a URL pública, algo como
   `https://gastos-app-backend-xxxxxxxxxx.southamerica-east1.run.app`
7. Configure as variáveis de ambiente pelo **Console** (mais simples que via CLI, evita
   erro de aspas/escaping no terminal): abra o serviço em
   [console.cloud.google.com/run](https://console.cloud.google.com/run) → **Edit & Deploy
   New Revision** → aba **Variables & Secrets** → adicione:
   - `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` → os três valores do Supabase (passo 1)
   - `JWT_SECRET` → qualquer string aleatória com 32+ caracteres
   - `ALLOWED_ORIGINS` → deixe `http://localhost:5173` por enquanto, você volta aqui
     depois do passo 3 com a URL do Vercel
   Clique em **Deploy** para aplicar.
8. Teste: `https://gastos-app-backend-xxxxxxxxxx.southamerica-east1.run.app/api/ping`
   deve responder `{"status":"ok"}`

> **Free tier do Cloud Run**: 2 milhões de requisições/mês, permanente (não expira). O
> serviço escala a zero quando ocioso — a primeira requisição depois de um tempo parado
> tem um delay de alguns segundos (bem mais rápido que o Render, mas não é instantâneo).
> Pra ficar sempre ligado sem esse delay seria necessário configurar `min-instances >= 1`,
> o que sai do free tier (passa a cobrar por tempo ocioso).

## 3. Frontend — Vercel

1. Crie uma conta em [vercel.com](https://vercel.com) e conecte sua conta do GitHub
2. **Add New → Project**, selecione o repositório `Fin-Control`
3. Em **Root Directory**, selecione `frontend` (importante — o projeto é um monorepo)
4. O Vercel detecta automaticamente que é um projeto Vite (build command `npm run build`,
   output `dist`) — não precisa mexer nisso
5. Em **Environment Variables**, adicione:
   - `VITE_API_URL` → `https://gastos-app-backend-xxxxxxxxxx.southamerica-east1.run.app/api`
     (a URL do Cloud Run do passo 2, com `/api` no final)
6. Clique em **Deploy**. Ao terminar, você recebe uma URL como
   `https://gastos-app.vercel.app`

## 4. Fechando o ciclo: atualizar o CORS no Cloud Run

Volte em [console.cloud.google.com/run](https://console.cloud.google.com/run) → serviço
`gastos-app-backend` → **Edit & Deploy New Revision** → **Variables & Secrets** → edite
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

Clique em **Deploy** para aplicar a mudança (gera uma nova revisão do serviço).

## 5. Teste final

Acesse a URL do Vercel, crie uma conta, defina seu salário e confirme que categorias,
metas, lançamentos e relatórios funcionam ponta a ponta contra o backend no Cloud Run e o
banco no Supabase.

## Deploy contínuo (opcional)

Toda vez que você fizer push no GitHub, o passo 5 acima (`gcloud run deploy`) precisa ser
rodado manualmente de novo para atualizar o backend. Para automatizar isso, configure um
**Cloud Build Trigger** conectado ao repositório GitHub:
[console.cloud.google.com/cloud-build/triggers](https://console.cloud.google.com/cloud-build/triggers) →
**Create Trigger** → conecte o repositório `Fin-Control` → evento "Push to branch: main" →
configuração de build "Dockerfile" com diretório `backend/Dockerfile`. A partir daí, cada
push no `main` reconstrói e reimplanta o backend automaticamente.

## Custos

| Serviço | Limite free tier | Cartão exigido? |
|---|---|---|
| Supabase | 500MB de banco, projeto pausa após 1 semana sem uso (reativa no primeiro acesso) | Não |
| Google Cloud Run | 2M requisições/mês, permanente, escala a zero quando ocioso | Sim (não cobra dentro do limite) |
| Vercel | 100GB de banda/mês, builds ilimitados para uso pessoal | Não |

Suficiente e sobrando para um projeto pessoal de controle de gastos.
