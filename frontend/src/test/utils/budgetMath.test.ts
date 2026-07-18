import { describe, expect, it } from 'vitest'
import { calcularExcedente, calcularProgresso, formatCurrency } from '../../utils/budgetMath'

describe('calcularExcedente', () => {
  it('retorna zero ou negativo quando a soma das metas nao ultrapassa o salario', () => {
    expect(calcularExcedente([500, 300, 200], 1000)).toBe(0)
    expect(calcularExcedente([500, 300], 1000)).toBe(-200)
  })

  it('retorna o valor positivo excedente quando a soma ultrapassa o salario', () => {
    expect(calcularExcedente([600, 300, 200], 1000)).toBeCloseTo(100)
  })

  it('lida com lista vazia de metas', () => {
    expect(calcularExcedente([], 1000)).toBe(-1000)
  })
})

describe('calcularProgresso', () => {
  it('classifica abaixo de 80% como verde', () => {
    expect(calcularProgresso(79, 100)).toBe('verde')
    expect(calcularProgresso(0, 100)).toBe('verde')
  })

  it('classifica entre 80% e 100% como amarelo', () => {
    expect(calcularProgresso(80, 100)).toBe('amarelo')
    expect(calcularProgresso(100, 100)).toBe('amarelo')
  })

  it('classifica acima de 100% como vermelho', () => {
    expect(calcularProgresso(100.01, 100)).toBe('vermelho')
    expect(calcularProgresso(150, 100)).toBe('vermelho')
  })

  it('trata meta zero: vermelho se houve gasto, verde se nao houve', () => {
    expect(calcularProgresso(10, 0)).toBe('vermelho')
    expect(calcularProgresso(0, 0)).toBe('verde')
  })
})

describe('formatCurrency', () => {
  it('formata valores no padrao R$ brasileiro', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56')
    expect(formatCurrency(0)).toBe('R$ 0,00')
  })
})
