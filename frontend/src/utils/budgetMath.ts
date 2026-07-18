export function formatCurrency(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/** Soma de metas menos o salário. Positivo = estourou o orçamento mensal. */
export function calcularExcedente(metas: number[], salario: number): number {
  const totalMetas = metas.reduce((acc, valor) => acc + valor, 0)
  return totalMetas - salario
}

export type ProgressoStatus = 'verde' | 'amarelo' | 'vermelho'

/** Verde: gasto < 80% da meta. Amarelo: 80-100%. Vermelho: acima da meta. */
export function calcularProgresso(gasto: number, meta: number): ProgressoStatus {
  if (meta <= 0) {
    return gasto > 0 ? 'vermelho' : 'verde'
  }
  const percentual = gasto / meta
  if (percentual > 1) return 'vermelho'
  if (percentual >= 0.8) return 'amarelo'
  return 'verde'
}
