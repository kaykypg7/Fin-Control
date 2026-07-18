CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    senha_hash VARCHAR(100) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE salaries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    mes_referencia VARCHAR(7) NOT NULL,
    valor NUMERIC(12, 2) NOT NULL CHECK (valor >= 0),
    CONSTRAINT uq_salary_user_month UNIQUE (user_id, mes_referencia)
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NULL REFERENCES users (id) ON DELETE CASCADE,
    nome VARCHAR(80) NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('FIXA', 'VARIAVEL')),
    grupo_503020 VARCHAR(12) NOT NULL CHECK (grupo_503020 IN ('NECESSIDADE', 'DESEJO', 'POUPANCA')),
    cor VARCHAR(7) NOT NULL,
    icone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_user_id ON categories (user_id);

-- user_id is required here (deviation from the original spec's Budget/Transaction
-- tables, which only carried categoryId): Category.user_id is nullable because
-- system-default categories (user_id NULL) are shared across every account, so a
-- budget/transaction row scoped only by category_id could not tell one user's
-- data apart from another's when both budget against the same shared category.
CREATE TABLE budgets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
    mes_referencia VARCHAR(7) NOT NULL,
    valor_meta NUMERIC(12, 2) NOT NULL CHECK (valor_meta >= 0),
    CONSTRAINT uq_budget_user_cat_month UNIQUE (user_id, category_id, mes_referencia)
);

CREATE INDEX idx_budgets_user_month ON budgets (user_id, mes_referencia);

CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories (id),
    valor NUMERIC(12, 2) NOT NULL CHECK (valor > 0),
    data DATE NOT NULL,
    descricao VARCHAR(255)
);

CREATE INDEX idx_transactions_user_data ON transactions (user_id, data);
CREATE INDEX idx_transactions_user_category ON transactions (user_id, category_id);
