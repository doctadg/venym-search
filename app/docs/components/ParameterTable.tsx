import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Parameter {
  name: string
  type: string
  required: boolean
  default?: string
  description: string
  example?: string
  enum?: string[]
}

interface ParameterTableProps {
  parameters: Parameter[]
  title?: string
}

export function ParameterTable({ parameters, title = "Parameters" }: ParameterTableProps) {
  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">Parameter</TableHead>
              <TableHead className="font-semibold text-gray-900">Type</TableHead>
              <TableHead className="font-semibold text-gray-900">Required</TableHead>
              <TableHead className="font-semibold text-gray-900">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parameters.map((param, index) => (
              <TableRow key={index} className="border-b">
                <TableCell className="font-medium">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded text-[#17457c]">
                    {param.name}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className="text-xs font-mono border-gray-300 text-gray-600"
                  >
                    {param.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={param.required ? "default" : "secondary"}
                    className={`text-xs ${
                      param.required 
                        ? "bg-red-100 text-red-800 hover:bg-red-100" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {param.required ? "Required" : "Optional"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-700 max-w-md">
                  <div className="space-y-2">
                    <p>{param.description}</p>
                    
                    {param.default && (
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Default:</span> {param.default}
                      </p>
                    )}
                    
                    {param.example && (
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Example:</span> 
                        <code className="ml-1 bg-gray-100 px-1 rounded">
                          {param.example}
                        </code>
                      </p>
                    )}
                    
                    {param.enum && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Options:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {param.enum.map((option, idx) => (
                            <code 
                              key={idx}
                              className="bg-gray-100 px-1 rounded text-xs"
                            >
                              {option}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

interface ResponseField {
  name: string
  type: string
  description: string
  example?: string
}

interface ResponseTableProps {
  fields: ResponseField[]
  title?: string
}

export function ResponseTable({ fields, title = "Response Fields" }: ResponseTableProps) {
  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">Field</TableHead>
              <TableHead className="font-semibold text-gray-900">Type</TableHead>
              <TableHead className="font-semibold text-gray-900">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={index} className="border-b">
                <TableCell className="font-medium">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded text-[#17457c]">
                    {field.name}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className="text-xs font-mono border-gray-300 text-gray-600"
                  >
                    {field.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-700 max-w-md">
                  <div className="space-y-2">
                    <p>{field.description}</p>
                    
                    {field.example && (
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Example:</span> 
                        <code className="ml-1 bg-gray-100 px-1 rounded">
                          {field.example}
                        </code>
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}