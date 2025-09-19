
"use client"

import { useState } from 'react'

export interface StripeErrorInfo {
  message: string
  type: 'card_error' | 'validation_error' | 'api_error' | 'network_error' | 'unknown_error'
  code?: string
  decline_code?: string
  param?: string
}

export const useStripeError = () => {
  const [error, setError] = useState<StripeErrorInfo | null>(null)

  const parseStripeError = (stripeError: any): StripeErrorInfo => {
    if (!stripeError) {
      return {
        message: 'An unknown error occurred',
        type: 'unknown_error'
      }
    }

    // Errores de tarjeta
    if (stripeError.type === 'card_error') {
      const cardErrorMessages: { [key: string]: string } = {
        'card_declined': 'Your card was declined. Please try a different payment method.',
        'expired_card': 'Your card has expired. Please use a different card.',
        'incorrect_cvc': 'Your card\'s security code is incorrect.',
        'incorrect_number': 'Your card number is incorrect.',
        'insufficient_funds': 'Your card has insufficient funds.',
        'invalid_cvc': 'Your card\'s security code is invalid.',
        'invalid_expiry_month': 'Your card\'s expiration month is invalid.',
        'invalid_expiry_year': 'Your card\'s expiration year is invalid.',
        'invalid_number': 'Your card number is invalid.',
        'processing_error': 'An error occurred processing your card. Please try again.',
        'authentication_required': 'Your card requires authentication. Please complete the verification.',
      }

      return {
        message: cardErrorMessages[stripeError.code] || stripeError.message || 'Your card was declined.',
        type: 'card_error',
        code: stripeError.code,
        decline_code: stripeError.decline_code,
        param: stripeError.param
      }
    }

    // Errores de validación
    if (stripeError.type === 'validation_error') {
      return {
        message: stripeError.message || 'Please check your payment information.',
        type: 'validation_error',
        code: stripeError.code,
        param: stripeError.param
      }
    }

    // Errores de API
    if (stripeError.type === 'api_error') {
      return {
        message: 'Payment service temporarily unavailable. Please try again.',
        type: 'api_error',
        code: stripeError.code
      }
    }

    // Errores de conexión
    if (stripeError.type === 'connection_error') {
      return {
        message: 'Network error. Please check your connection and try again.',
        type: 'network_error',
        code: stripeError.code
      }
    }

    // Errores de rate limit
    if (stripeError.type === 'rate_limit_error') {
      return {
        message: 'Too many requests. Please wait a moment and try again.',
        type: 'api_error',
        code: stripeError.code
      }
    }

    // Error genérico
    return {
      message: stripeError.message || 'An unexpected error occurred. Please try again.',
      type: 'unknown_error',
      code: stripeError.code
    }
  }

  const setStripeError = (stripeError: any) => {
    const errorInfo = parseStripeError(stripeError)
    setError(errorInfo)
  }

  const clearError = () => {
    setError(null)
  }

  const getErrorSuggestion = (errorInfo: StripeErrorInfo): string => {
    switch (errorInfo.type) {
      case 'card_error':
        if (errorInfo.code === 'card_declined') {
          return 'Try using a different card or contact your bank.'
        }
        if (errorInfo.code === 'insufficient_funds') {
          return 'Please check your account balance or use a different card.'
        }
        if (errorInfo.code?.includes('incorrect') || errorInfo.code?.includes('invalid')) {
          return 'Please double-check your card information and try again.'
        }
        return 'Please try a different payment method.'
      
      case 'validation_error':
        return 'Please check all required fields and try again.'
      
      case 'api_error':
        return 'This is a temporary issue. Please try again in a few minutes.'
      
      case 'network_error':
        return 'Please check your internet connection and try again.'
      
      default:
        return 'If the problem persists, please contact our support team.'
    }
  }

  return {
    error,
    setStripeError,
    clearError,
    getErrorSuggestion,
    hasError: !!error
  }
}
