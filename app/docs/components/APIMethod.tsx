import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface APIMethodProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  endpoint: string
  description?: string
  baseUrl?: string
}

export function APIMethod({ method, endpoint, description, baseUrl = "https://www.search.venym.io/api" }: APIMethodProps) {
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'POST':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      case 'DELETE':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      case 'PATCH':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  return (
    <Card className="my-6 border-l-4 border-l-[#efa72d]">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Badge className={`text-sm font-mono font-bold px-3 py-1 ${getMethodColor(method)}`}>
            {method}
          </Badge>
          <code className="text-lg font-mono text-gray-800 bg-gray-100 px-3 py-2 rounded-md flex-1">
            {baseUrl}{endpoint}
          </code>
        </div>
        
        {description && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface StatusCodeProps {
  code: number
  description: string
}

export function StatusCode({ code, description }: StatusCodeProps) {
  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) {
      return 'bg-green-100 text-green-800 hover:bg-green-100'
    } else if (code >= 400 && code < 500) {
      return 'bg-red-100 text-red-800 hover:bg-red-100'
    } else if (code >= 500) {
      return 'bg-red-100 text-red-800 hover:bg-red-100'
    } else {
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <Badge className={`text-sm font-mono font-bold px-2 py-1 ${getStatusColor(code)}`}>
        {code}
      </Badge>
      <span className="text-sm text-gray-700">{description}</span>
    </div>
  )
}