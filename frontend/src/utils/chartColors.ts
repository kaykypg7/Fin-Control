// Paleta categórica validada (CVD-safe), reference/palette.md do skill dataviz.
// Ordem fixa dos slots é o mecanismo de segurança para daltonismo - nunca reordenar.
export const CATEGORICAL_LIGHT = [
  '#2a78d6', // 1 blue
  '#1baf7a', // 2 aqua
  '#eda100', // 3 yellow
  '#008300', // 4 green
  '#4a3aa7', // 5 violet
  '#e34948', // 6 red
  '#e87ba4', // 7 magenta
  '#eb6834', // 8 orange
]

export const CATEGORICAL_DARK = [
  '#3987e5',
  '#199e70',
  '#c98500',
  '#008300',
  '#9085e9',
  '#e66767',
  '#d55181',
  '#d95926',
]

export const STATUS_COLORS = {
  light: { good: '#0ca30c', warning: '#fab219', critical: '#d03b3b' },
  dark: { good: '#0ca30c', warning: '#fab219', critical: '#d03b3b' },
}

export const CHART_INK = {
  light: { primary: '#0b0b0b', secondary: '#52514e', muted: '#898781', grid: '#e1e0d9' },
  dark: { primary: '#ffffff', secondary: '#c3c2b7', muted: '#898781', grid: '#2c2c2a' },
}

export function categoricalPalette(theme: 'light' | 'dark'): string[] {
  return theme === 'dark' ? CATEGORICAL_DARK : CATEGORICAL_LIGHT
}

const MAX_CATEGORICAL_SLOTS = 8

/** Agrupa itens além dos 8 slots categóricos em "Outras" — nunca gera um hue extra. */
export function foldIntoOther<T extends { valor: number }>(
  items: T[],
  labelOf: (item: T) => string,
  otherLabel = 'Outras',
): { label: string; valor: number }[] {
  if (items.length <= MAX_CATEGORICAL_SLOTS) {
    return items.map((item) => ({ label: labelOf(item), valor: item.valor }))
  }
  const visible = items.slice(0, MAX_CATEGORICAL_SLOTS - 1)
  const rest = items.slice(MAX_CATEGORICAL_SLOTS - 1)
  const restTotal = rest.reduce((acc, item) => acc + item.valor, 0)
  return [
    ...visible.map((item) => ({ label: labelOf(item), valor: item.valor })),
    { label: otherLabel, valor: restTotal },
  ]
}
