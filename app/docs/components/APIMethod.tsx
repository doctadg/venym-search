interface APIMethodProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  endpoint: string
  description?: string
  baseUrl?: string
}

const methodTone: Record<string, string> = {
  GET: 'text-emerald-300/80 border-emerald-400/20',
  POST: 'text-sky-300/80 border-sky-400/20',
  PUT: 'text-amber-300/80 border-amber-400/20',
  DELETE: 'text-rose-300/80 border-rose-400/20',
  PATCH: 'text-violet-300/80 border-violet-400/20',
}

export function APIMethod({ method, endpoint, description, baseUrl = "https://www.search.venym.io/api" }: APIMethodProps) {
  return (
    <div className="my-6 border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${methodTone[method] ?? 'text-white/70 border-white/15'}`}>
          {method}
        </span>
        <code className="text-[13px] font-mono text-white/80 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-sm flex-1 min-w-0 truncate">
          {baseUrl}{endpoint}
        </code>
      </div>

      {description && (
        <p className="text-[13px] text-white/55 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}

interface StatusCodeProps {
  code: number
  description: string
}

export function StatusCode({ code, description }: StatusCodeProps) {
  const tone =
    code >= 200 && code < 300
      ? 'text-emerald-300/80 border-emerald-400/20'
      : code >= 400
      ? 'text-rose-300/80 border-rose-400/20'
      : 'text-white/60 border-white/15'

  return (
    <div className="flex items-center gap-3 py-2">
      <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${tone}`}>
        {code}
      </span>
      <span className="text-[13px] text-white/70">{description}</span>
    </div>
  )
}
