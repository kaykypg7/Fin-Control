import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BudgetAlertBanner } from '../../components/budget/BudgetAlertBanner'

describe('BudgetAlertBanner', () => {
  it('nao renderiza nada quando nao ha excedente', () => {
    const { container } = render(<BudgetAlertBanner totalMetas={800} excedente={0} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('nao renderiza nada quando o excedente e negativo', () => {
    const { container } = render(<BudgetAlertBanner totalMetas={800} excedente={-200} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renderiza a mensagem exata quando ha excedente', () => {
    render(<BudgetAlertBanner totalMetas={6200} excedente={200} />)
    expect(
      screen.getByText('Suas metas somam R$ 6.200,00, que é R$ 200,00 acima do seu salário mensal.'),
    ).toBeInTheDocument()
  })
})
