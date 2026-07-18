export type Role = 'USER' | 'ADMIN'
export type CategoryTipo = 'FIXA' | 'VARIAVEL'
export type Grupo503020 = 'NECESSIDADE' | 'DESEJO' | 'POUPANCA'

export interface Usuario {
  id: number
  nome: string
  email: string
  role: Role
}

export interface AuthResponse {
  token: string
  usuario: Usuario
}

export interface Categoria {
  id: number
  nome: string
  tipo: CategoryTipo
  grupo503020: Grupo503020
  cor: string
  icone: string
  sistemaPadrao: boolean
}

export interface CategoriaRequest {
  nome: string
  tipo: CategoryTipo
  grupo503020: Grupo503020
  cor: string
  icone: string
}

export interface Salario {
  id: number
  mesReferencia: string
  valor: number
}

export interface Meta {
  id: number
  categoryId: number
  mesReferencia: string
  valorMeta: number
}

export interface MetaItemRequest {
  categoryId: number
  valorMeta: number
}

export interface RecommendationCategoryItem {
  categoryId: number
  nome: string
  valorSugerido: number
  baseadoEmHistorico: boolean
}

export interface RecommendationGroup {
  grupo: Grupo503020
  valorAlocado: number
  categorias: RecommendationCategoryItem[]
}

export interface BudgetRecommendationResponse {
  mesReferencia: string
  salarioBase: number
  grupos: RecommendationGroup[]
  naoAlocado: number
  avisos: string[]
}

export interface Transacao {
  id: number
  categoryId: number
  valor: number
  data: string
  descricao: string | null
}

export interface TransacaoRequest {
  categoryId: number
  valor: number
  data: string
  descricao?: string | null
}

export interface CategorySummaryItem {
  categoryId: number
  nome: string
  cor: string
  grupo503020: Grupo503020 | null
  valorMeta: number
  valorGasto: number
}

export interface MonthlySummaryResponse {
  mesReferencia: string
  salario: number | null
  totalMetas: number
  totalGasto: number
  porCategoria: CategorySummaryItem[]
}

export interface MonthlyComparisonItem {
  mesReferencia: string
  salario: number | null
  totalMeta: number
  totalGasto: number
}

export interface CategoryEvolutionItem {
  mesReferencia: string
  categoryId: number
  nome: string
  valorGasto: number
}

export interface AdminUserResponse {
  id: number
  nome: string
  email: string
  role: Role
  createdAt: string
  totalLancamentos: number
}

export interface AdminMetricsResponse {
  totalUsuarios: number
  totalCategoriasSistema: number
  totalLancamentos: number
  mediaLancamentosPorUsuario: number
}

export interface ApiErrorResponse {
  code: string
  message: string
  timestamp: string
  fieldErrors: { campo: string; mensagem: string }[]
}
