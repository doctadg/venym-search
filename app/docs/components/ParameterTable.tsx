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

const headerCell = "text-[10px] font-mono uppercase tracking-[0.15em] text-white/40"

export function ParameterTable({ parameters, title = "Parameters" }: ParameterTableProps) {
  return (
    <div className="my-8">
      <div className="venym-meta mb-3">{title}</div>

      <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className={headerCell}>Parameter</TableHead>
              <TableHead className={headerCell}>Type</TableHead>
              <TableHead className={headerCell}>Required</TableHead>
              <TableHead className={headerCell}>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parameters.map((param, index) => (
              <TableRow key={index} className="border-white/[0.06] hover:bg-white/[0.02] align-top">
                <TableCell>
                  <code className="text-[12px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 px-2 py-0.5 rounded-sm">
                    {param.name}
                  </code>
                </TableCell>
                <TableCell>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-white/10 text-white/60">
                    {param.type}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${param.required ? 'border-rose-400/20 text-rose-300/80' : 'border-white/10 text-white/40'}`}>
                    {param.required ? "Required" : "Optional"}
                  </span>
                </TableCell>
                <TableCell className="text-[13px] text-white/70 max-w-md">
                  <div className="space-y-2">
                    <p>{param.description}</p>

                    {param.default && (
                      <p className="text-[11px] font-mono text-white/40">
                        <span className="uppercase tracking-[0.15em] text-white/30">Default:</span> {param.default}
                      </p>
                    )}

                    {param.example && (
                      <p className="text-[11px] font-mono text-white/40">
                        <span className="uppercase tracking-[0.15em] text-white/30">Example:</span>{' '}
                        <code className="ml-1 bg-white/[0.04] border border-white/[0.06] px-1 rounded-sm text-white/70">
                          {param.example}
                        </code>
                      </p>
                    )}

                    {param.enum && (
                      <div className="text-[11px] font-mono text-white/40">
                        <span className="uppercase tracking-[0.15em] text-white/30">Options:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {param.enum.map((option, idx) => (
                            <code
                              key={idx}
                              className="bg-white/[0.04] border border-white/[0.06] px-1 rounded-sm text-white/70"
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
      <div className="venym-meta mb-3">{title}</div>

      <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className={headerCell}>Field</TableHead>
              <TableHead className={headerCell}>Type</TableHead>
              <TableHead className={headerCell}>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={index} className="border-white/[0.06] hover:bg-white/[0.02] align-top">
                <TableCell>
                  <code className="text-[12px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/80 px-2 py-0.5 rounded-sm">
                    {field.name}
                  </code>
                </TableCell>
                <TableCell>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-white/10 text-white/60">
                    {field.type}
                  </span>
                </TableCell>
                <TableCell className="text-[13px] text-white/70 max-w-md">
                  <div className="space-y-2">
                    <p>{field.description}</p>

                    {field.example && (
                      <p className="text-[11px] font-mono text-white/40">
                        <span className="uppercase tracking-[0.15em] text-white/30">Example:</span>{' '}
                        <code className="ml-1 bg-white/[0.04] border border-white/[0.06] px-1 rounded-sm text-white/70">
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
