import { Button } from '../ui/Button'

export function RecommendationButton({
  onClick,
  isLoading,
}: {
  onClick: () => void
  isLoading: boolean
}) {
  return (
    <Button type="button" variant="secondary" onClick={onClick} disabled={isLoading}>
      {isLoading ? 'Calculando...' : 'Aplicar recomendação 50/30/20'}
    </Button>
  )
}
