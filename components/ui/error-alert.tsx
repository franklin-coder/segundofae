
"use client"

import { AlertCircle, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface ErrorAlertProps {
  title?: string
  message: string
  suggestion?: string
  onDismiss?: () => void
  variant?: 'destructive' | 'warning' | 'info'
}

const ErrorAlert = ({ 
  title = "Error", 
  message, 
  suggestion, 
  onDismiss,
  variant = 'destructive' 
}: ErrorAlertProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return 'border-orange-200 bg-orange-50 text-orange-800'
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800'
      default:
        return 'border-red-200 bg-red-50 text-red-800'
    }
  }

  const getIconColor = () => {
    switch (variant) {
      case 'warning':
        return 'text-orange-600'
      case 'info':
        return 'text-blue-600'
      default:
        return 'text-red-600'
    }
  }

  return (
    <Alert className={getVariantStyles()}>
      <AlertCircle className={`h-4 w-4 ${getIconColor()}`} />
      <AlertDescription>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="font-medium mb-1">{title}</div>
            <div className="mb-2">{message}</div>
            {suggestion && (
              <div className="text-sm opacity-90">
                <strong>Suggestion:</strong> {suggestion}
              </div>
            )}
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}

export default ErrorAlert
