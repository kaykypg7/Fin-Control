# Deploy gratuito — Supabase + Render + Vercel

Este guia cobre as etapas que só você pode fazer (criar contas, conectar o GitHub, colar
variáveis de ambiente nos painéis). O código já está preparado: `backend/Dockerfile`,
`frontend/vercel.json`, e as configs de porta/CORS/banco via variáveis de ambiente.

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
3. Guarde três valores separados, que você vai usar no passo 2 (Render):
   - **DB_URL**: `jdbc:postgresql://aws-0-xxxxx.pooler.supabase.com:5432/postgres?sslmode=require`
     (mesmo host/porta/banco da connection string, prefixado com `jdbc:` e com
     `?sslmode=require` no final — o Supabase exige SSL)
   - **DB_USERNAME**: `postgres.xxxxxxxxxxxx` (a parte entre `postgresql://` e `:`, com
     o ponto e o ref do projeto — não é só `postgres`)
   - **DB_PASSWORD**: a senha do banco

## 2. Backend — Render

Você já tem uma conta/projeto no Render. O free tier limita a conta a **1 projeto**, então
o segredo aqui é **não** usar o fluxo "New → Blueprint" (que sempre cria um projeto novo) —
em vez disso, adicione este backend como um **novo Web Service dentro do projeto que você
já tem**:

1. Entre no projeto existente no painel do Render
2. **New → Web Service** (não "Blueprint")
3. Conecte o repositório `Fin-Control` (autorize o Render a acessar sua conta do GitHub,
   se ainda não tiver feito)
4. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: Docker (o Render detecta o `Dockerfile` automaticamente dentro de `backend/`)
   - **Instance Type**: Free
5. Em **Environment Variables**, adicione uma por uma:
   - `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` → os três valores do Supabase (passo 1)
   - `JWT_SECRET` → qualquer string aleatória com 32+ caracteres (ex.: gere uma em
     [1password.com/password-generator](https://1password.com/password-generator) ou
     digite algo bem aleatório manualmente)
   - `ALLOWED_ORIGINS` → deixe `http://localhost:5173` por enquanto, você volta aqui
     depois do passo 3 com a URL do Vercel
6. **Create Web Service**. O primeiro build demora alguns minutos (build da imagem Docker).
   Quando terminar, anote a URL pública, algo como `https://gastos-app-backend.onrender.com`
7. Teste: `https://gastos-app-backend.onrender.com/api/ping` deve responder `{"status":"ok"}`

> **Plano free do Render**: o serviço "dorme" após ~15 min sem receber requisições, e a
> próxima requisição demora ~30-50s para acordar. Normal e aceitável para um projeto
> pessoal — não é um bug, é o preço do "grátis sem cartão de crédito".

## 3. Frontend — Vercel

1. Crie uma conta em [vercel.com](https://vercel.com) e conecte sua conta do GitHub
2. **Add New → Project**, selecione o repositório `Fin-Control`
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

| Serviço | Limite free tier | Cartão exigido? |
|---|---|---|
| Supabase | 500MB de banco, projeto pausa após 1 semana sem uso (reativa no primeiro acesso) | Não |
| Render | 1 projeto por conta, 750h/mês de compute, dorme após 15min de inatividade | Não |
| Vercel | 100GB de banda/mês, builds ilimitados para uso pessoal | Não |

Suficiente e sobrando para um projeto pessoal de controle de gastos — e sem cadastrar
cartão de crédito em lugar nenhum.
