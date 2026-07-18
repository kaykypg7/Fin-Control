import { isAxiosError } from 'axios'
import type { ApiErrorResponse } from '../types/api'

export function extractErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado'): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? fallback
  }
  return fallback
}

/** Mapa campo -> mensagem, a partir dos fieldErrors de validacao do backend (Bean Validation). */
export function extractFieldErrors(error: unknown): Record<string, string> {
  if (isAxiosError<ApiErrorResponse>(error) && error.response?.data?.fieldErrors) {
    return Object.fromEntries(
      error.response.data.fieldErrors.map((fe) => [fe.campo, fe.mensagem]),
    )
  }
  return {}
}
