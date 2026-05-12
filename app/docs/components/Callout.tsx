import { AlertTriangle, CheckCircle, Info, XCircle, Lightbulb, Zap } from 'lucide-react'

interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success' | 'tip' | 'important'
  title?: string
  children: React.ReactNode
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const config = {
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-800'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
      textColor: 'text-yellow-800'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      textColor: 'text-red-800'
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      textColor: 'text-green-800'
    },
    tip: {
      icon: Lightbulb,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      titleColor: 'text-purple-900',
      textColor: 'text-purple-800'
    },
    important: {
      icon: Zap,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600',
      titleColor: 'text-orange-900',
      textColor: 'text-orange-800'
    }
  }

  const { icon: Icon, bgColor, borderColor, iconColor, titleColor, textColor } = config[type]

  return (
    <div className={`rounded-lg border-l-4 p-4 ${bgColor} ${borderColor} my-6`}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 mt-0.5 ${iconColor} flex-shrink-0`} />
        <div className="flex-1">
          {title && (
            <h5 className={`font-semibold mb-2 ${titleColor}`}>
              {title}
            </h5>
          )}
          <div className={`text-sm leading-relaxed ${textColor}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}