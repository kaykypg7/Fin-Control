# Deploy gratuito — Supabase + Fly.io + Vercel

Este guia cobre as etapas que só você pode fazer (criar contas, conectar o GitHub, colar
variáveis de ambiente/secrets nos painéis). O código já está preparado: `backend/Dockerfile`,
`backend/fly.toml`, `frontend/vercel.json`, e as configs de porta/CORS/banco via variáveis de
ambiente.

> Por que Fly.io e não Render? O Render free tier limita a conta a 1 projeto e o serviço
> "dorme" após 15min de inatividade (delay de ~30-50s pra acordar). O Fly.io, configurado
> com `min_machines_running = 1` (já feito no `fly.toml`), fica sempre ligado dentro do
> free tier — sem delay. O único custo é cadastrar um cartão de crédito na conta (não é
> cobrado dentro do limite grátis).

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
3. Guarde três valores separados, que você vai usar no passo 2 (Fly.io):
   - **DB_URL**: `jdbc:postgresql://aws-0-xxxxx.pooler.supabase.com:5432/postgres?sslmode=require`
     (mesmo host/porta/banco da connection string, prefixado com `jdbc:` e com
     `?sslmode=require` no final — o Supabase exige SSL)
   - **DB_USERNAME**: `postgres.xxxxxxxxxxxx` (a parte entre `postgresql://` e `:`, com
     o ponto e o ref do projeto — não é só `postgres`)
   - **DB_PASSWORD**: a senha do banco

## 2. Backend — Fly.io

1. Crie uma conta em [fly.io](https://fly.io) (pede cartão de crédito para verificação,
   não cobra dentro do free tier)
2. Instale a CLI `flyctl`:
   ```
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```
3. Faça login:
   ```
   fly auth login
   ```
   (abre o navegador para autenticar)
4. Na pasta `backend/` do projeto, crie o app no Fly (o `fly.toml` já existe, então ele
   só registra o app com o nome já definido — se `gastos-app-backend` já estiver em uso
   por outra pessoa, o comando vai pedir um nome alternativo):
   ```
   cd backend
   fly apps create gastos-app-backend
   ```
5. Configure os secrets (nunca vão para o `fly.toml`, ficam só no Fly):
   ```
   fly secrets set DB_URL="jdbc:postgresql://aws-0-xxxxx.pooler.supabase.com:5432/postgres?sslmode=require"
   fly secrets set DB_USERNAME="postgres.xxxxxxxxxxxx"
   fly secrets set DB_PASSWORD="sua-senha-do-supabase"
   fly secrets set JWT_SECRET="$(openssl rand -base64 48)"
   fly secrets set ALLOWED_ORIGINS="http://localhost:5173"
   ```
   (no Windows, se não tiver `openssl`, gere o `JWT_SECRET` com qualquer string aleatória
   de 32+ caracteres — pode ser `fly secrets set JWT_SECRET="uma-frase-bem-longa-e-aleatoria-so-sua-1234567890"`)
6. Deploy:
   ```
   fly deploy
   ```
   O Fly builda a imagem Docker (usando o `backend/Dockerfile`) e sobe a VM. Leva alguns
   minutos na primeira vez.
7. Teste: `https://gastos-app-backend.fly.dev/api/ping` deve responder `{"status":"ok"}`

## 3. Frontend — Vercel

1. Crie uma conta em [vercel.com](https://vercel.com) e conecte sua conta do GitHub
2. **Add New → Project**, selecione o repositório `Fin-Control`
3. Em **Root Directory**, selecione `frontend` (importante — o projeto é um monorepo)
4. O Vercel detecta automaticamente que é um projeto Vite (build command `npm run build`,
   output `dist`) — não precisa mexer nisso
5. Em **Environment Variables**, adicione:
   - `VITE_API_URL` → `https://gastos-app-backend.fly.dev/api` (a URL do Fly.io do
     passo 2, com `/api` no final)
6. Clique em **Deploy**. Ao terminar, você recebe uma URL como
   `https://gastos-app.vercel.app`

## 4. Fechando o ciclo: atualizar o CORS no Fly.io

De volta ao terminal, na pasta `backend/`:

```
fly secrets set ALLOWED_ORIGINS="https://gastos-app.vercel.app"
```

Se você também quiser que os preview deployments do Vercel (URLs tipo
`gastos-app-git-branch-usuario.vercel.app`) funcionem, use um padrão com curinga,
separado por vírgula:

```
fly secrets set ALLOWED_ORIGINS="https://gastos-app.vercel.app,https://*.vercel.app"
```

Definir um secret novo já dispara um redeploy automático do backend.

## 5. Teste final

Acesse a URL do Vercel, crie uma conta, defina seu salário e confirme que categorias,
metas, lançamentos e relatórios funcionam ponta a ponta contra o backend no Fly.io e o
banco no Supabase.

## Comandos úteis do Fly.io

```
fly logs                 # ver logs em tempo real
fly status                # ver se a maquina esta rodando
fly secrets list          # ver quais secrets estao definidos (sem mostrar valores)
fly deploy                # redeploy manual (normalmente automatico via GitHub Actions se configurar)
```

## Custos

| Serviço | Limite free tier | Cartão exigido? |
|---|---|---|
| Supabase | 500MB de banco, projeto pausa após 1 semana sem uso (reativa no primeiro acesso) | Não |
| Fly.io | 3 VMs shared-cpu-1x pequenas incluídas, sempre ligadas (sem sleep) | Sim (não cobra dentro do limite) |
| Vercel | 100GB de banda/mês, builds ilimitados para uso pessoal | Não |

Suficiente e sobrando para um projeto pessoal de controle de gastos.
