import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useBudgetAlert } from '../../hooks/useBudgetAlert'

describe('useBudgetAlert', () => {
  it('recalcula quando os valores mudam, sem estourar quando soma <= salario', () => {
    const { result, rerender } = renderHook(({ valores, salario }) => useBudgetAlert(valores, salario), {
      initialProps: { valores: [500, 300], salario: 1000 },
    })

    expect(result.current.totalMetas).toBe(800)
    expect(result.current.isOverBudget).toBe(false)

    rerender({ valores: [700, 400], salario: 1000 })

    expect(result.current.totalMetas).toBe(1100)
    expect(result.current.excedente).toBe(100)
    expect(result.current.isOverBudget).toBe(true)
  })

  it('retorna isOverBudget verdadeiro apenas quando a soma ultrapassa o salario', () => {
    const { result } = renderHook(() => useBudgetAlert([1000], 1000))
    expect(result.current.isOverBudget).toBe(false)

    const { result: result2 } = renderHook(() => useBudgetAlert([1000.01], 1000))
    expect(result2.current.isOverBudget).toBe(true)
  })
})
