import type { CategoryEvolutionItem } from '../types/api'

export interface PivotedMonth {
  mesReferencia: string
  [categoryName: string]: string | number
}

/** Pivota o formato long (uma linha por mes+categoria) para wide (uma linha por mes,
 * uma coluna por categoria) - o formato que o Recharts LineChart espera para
 * desenhar uma <Line> por categoria mantendo o backend generico. */
export function pivotByMonth(items: CategoryEvolutionItem[]): {
  data: PivotedMonth[]
  categoryNames: string[]
} {
  const monthsOrder: string[] = []
  const byMonth = new Map<string, PivotedMonth>()
  const categoryNames = new Set<string>()

  for (const item of items) {
    if (!byMonth.has(item.mesReferencia)) {
      byMonth.set(item.mesReferencia, { mesReferencia: item.mesReferencia })
      monthsOrder.push(item.mesReferencia)
    }
    byMonth.get(item.mesReferencia)![item.nome] = item.valorGasto
    categoryNames.add(item.nome)
  }

  const data = monthsOrder.map((mes) => byMonth.get(mes)!)
  return { data, categoryNames: Array.from(categoryNames) }
}
