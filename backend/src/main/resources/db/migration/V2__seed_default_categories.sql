-- Categorias padrao do sistema (user_id NULL = visivel/editavel por todos os usuarios,
-- gerenciadas pelo admin). Mapeamento para a regra 50/30/20:
--   NECESSIDADE: Contas Fixas, Alimentacao, Transporte, Saude, Educacao
--   DESEJO:      Cartao de Credito, Lazer
--   POUPANCA:    Investimentos/Poupanca
INSERT INTO categories (user_id, nome, tipo, grupo_503020, cor, icone) VALUES
    (NULL, 'Cartão de Crédito',        'VARIAVEL', 'DESEJO',      '#F97316', 'credit-card'),
    (NULL, 'Contas Fixas',             'FIXA',     'NECESSIDADE', '#3B82F6', 'home'),
    (NULL, 'Alimentação',              'VARIAVEL', 'NECESSIDADE', '#22C55E', 'utensils'),
    (NULL, 'Transporte',               'VARIAVEL', 'NECESSIDADE', '#06B6D4', 'car'),
    (NULL, 'Saúde',                    'VARIAVEL', 'NECESSIDADE', '#EF4444', 'heart-pulse'),
    (NULL, 'Lazer',                    'VARIAVEL', 'DESEJO',      '#A855F7', 'party-popper'),
    (NULL, 'Educação',                 'VARIAVEL', 'NECESSIDADE', '#EAB308', 'graduation-cap'),
    (NULL, 'Investimentos/Poupança',   'VARIAVEL', 'POUPANCA',    '#10B981', 'piggy-bank');
