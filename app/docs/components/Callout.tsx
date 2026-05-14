import { AlertTriangle, CheckCircle, Info, XCircle, Lightbulb, Zap } from 'lucide-react'

interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success' | 'tip' | 'important'
  title?: string
  children: React.ReactNode
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const config = {
    info: { icon: Info, accent: 'text-sky-400/80', label: 'INFO' },
    warning: { icon: AlertTriangle, accent: 'text-amber-400/80', label: 'WARNING' },
    error: { icon: XCircle, accent: 'text-rose-400/80', label: 'ERROR' },
    success: { icon: CheckCircle, accent: 'text-emerald-400/80', label: 'SUCCESS' },
    tip: { icon: Lightbulb, accent: 'text-violet-400/80', label: 'TIP' },
    important: { icon: Zap, accent: 'text-orange-400/80', label: 'IMPORTANT' },
  }

  const { icon: Icon, accent, label } = config[type]

  return (
    <div className="my-6 border border-white/[0.06] bg-white/[0.02] rounded-sm">
      <div className="flex items-start gap-3 p-5">
        <Icon className={`h-3.5 w-3.5 mt-0.5 ${accent} shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className={`text-[10px] font-mono uppercase tracking-[0.2em] ${accent} mb-2`}>
            {title || label}
          </div>
          <div className="text-[13px] text-white/70 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
