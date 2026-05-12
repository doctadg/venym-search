'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Palette, Copy, Check, ChevronDown, RefreshCw, Eye, Contrast } from 'lucide-react'

interface ColorResult {
  input: string
  detected_format: string
  formats: {
    hex: string
    rgb: { r: number; g: number; b: number }
    hsl: { h: number; s: number; l: number }
    rgba: string
    hsla: string
  }
  contrast: {
    white_text: { ratio: number; aa_normal: boolean; aa_large: boolean; aaa_normal: boolean; aaa_large: boolean }
    black_text: { ratio: number; aa_normal: boolean; aa_large: boolean; aaa_normal: boolean; aaa_large: boolean }
  }
  palette: {
    complementary: string
    analogous: string[]
    triadic: string[]
    split_complementary: string[]
  }
}

function PaletteSection({ title, colors }: { title: string; colors: string[] }) {
  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div>
      <Label className="text-xs text-gray-500 mb-2 block">{title}</Label>
      <div className="flex gap-2">
        {colors.map((color, i) => (
          <button
            key={i}
            onClick={() => copy(color, title + i)}
            className="group relative flex-1"
            title={color}
          >
            <div
              className="h-12 rounded-lg border border-gray-200 group-hover:scale-105 transition-transform cursor-pointer"
              style={{ backgroundColor: color }}
            />
            <div className="text-[10px] text-gray-400 mt-1 text-center font-mono">{color}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function ContrastBar({ label, ratio, checks, bg }: { label: string; ratio: number; checks: { aa_normal: boolean; aa_large: boolean; aaa_normal: boolean; aaa_large: boolean }; bg: string }) {
  return (
    <div className="p-3 rounded-lg border border-gray-200" style={{ backgroundColor: bg }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: label === 'White text' ? '#fff' : '#000' }}>
          {label}
        </span>
        <span className="text-sm font-bold font-mono" style={{ color: label === 'White text' ? '#fff' : '#000' }}>
          {ratio}:1
        </span>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {[
          { label: 'AA Normal', pass: checks.aa_normal },
          { label: 'AA Large', pass: checks.aa_large },
          { label: 'AAA Normal', pass: checks.aaa_normal },
          { label: 'AAA Large', pass: checks.aaa_large },
        ].map(c => (
          <Badge
            key={c.label}
            variant="outline"
            className={`text-[10px] px-1.5 py-0 ${
              c.pass
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-red-100 text-red-800 border-red-200'
            }`}
          >
            {c.label}: {c.pass ? 'Pass' : 'Fail'}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export default function ColorConverterPage() {
  const [colorInput, setColorInput] = useState('#17457c')
  const [nativeColor, setNativeColor] = useState('#17457c')
  const [result, setResult] = useState<ColorResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const convert = async () => {
    if (!colorInput.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/v1/tools/color-convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color: colorInput.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to convert'); return }
      setResult(data)
      setNativeColor(data.formats.hex)
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value
    setNativeColor(hex)
    setColorInput(hex)
  }

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const randomColor = () => {
    const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    setColorInput(hex)
    setNativeColor(hex)
  }

  const formats = result ? [
    { label: 'HEX', value: result.formats.hex, key: 'hex' },
    { label: 'RGB', value: `rgb(${result.formats.rgb.r}, ${result.formats.rgb.g}, ${result.formats.rgb.b})`, key: 'rgb' },
    { label: 'HSL', value: `hsl(${result.formats.hsl.h}, ${result.formats.hsl.s}%, ${result.formats.hsl.l}%)`, key: 'hsl' },
    { label: 'RGBA', value: result.formats.rgba, key: 'rgba' },
    { label: 'HSLA', value: result.formats.hsla, key: 'hsla' },
  ] : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#17457c]/10 rounded-lg">
              <Palette className="w-6 h-6 text-[#17457c]" />
            </div>
            <Badge className="bg-[#efa72d]/10 text-[#efa72d] hover:bg-[#efa72d]/10 border-0">Free Tool</Badge>
          </div>
          <h1 className="text-3xl font-bold text-[#17457c] mb-2">Color Converter</h1>
          <p className="text-gray-600">Convert colors between HEX, RGB, HSL, and more. Generate palettes and check contrast ratios.</p>
        </div>

        {/* Input */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1 w-full">
                <Label htmlFor="color-input">Color Value</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="color-input"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    placeholder="#17457c, rgb(23,69,124), hsl(210,68%,29%), red"
                    className="flex-1 font-mono text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && convert()}
                  />
                  <div className="relative">
                    <input
                      type="color"
                      value={nativeColor}
                      onChange={handleNativeChange}
                      className="w-12 h-10 rounded border border-gray-200 cursor-pointer p-0.5"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Supports: hex (#fff, #ffffff), rgb(), hsl(), named colors</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={convert} disabled={!colorInput.trim() || loading} className="bg-[#17457c] hover:bg-[#17457c]/90 text-white">
                  {loading ? 'Converting...' : 'Convert'}
                </Button>
                <Button variant="outline" onClick={randomColor} title="Random color">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4 text-red-700">{error}</CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-6">
            {/* Color Preview */}
            <div className="grid sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Color Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="h-32 rounded-lg border border-gray-200"
                    style={{ backgroundColor: result.formats.hex }}
                  />
                  <p className="text-xs text-gray-400 mt-2">Detected format: <Badge variant="secondary" className="text-[10px] ml-1">{result.detected_format}</Badge></p>
                </CardContent>
              </Card>

              {/* Contrast Checker */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Contrast className="w-4 h-4" /> Contrast Checker (WCAG)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ContrastBar
                    label="White text"
                    ratio={result.contrast.white_text.ratio}
                    checks={result.contrast.white_text}
                    bg={result.formats.hex}
                  />
                  <ContrastBar
                    label="Black text"
                    ratio={result.contrast.black_text.ratio}
                    checks={result.contrast.black_text}
                    bg={result.formats.hex}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Format Values */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Color Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {formats.map(f => (
                    <div key={f.key} className="flex items-center gap-2">
                      <Badge variant="outline" className="w-16 justify-center shrink-0 text-xs">{f.label}</Badge>
                      <code className="flex-1 text-sm bg-gray-100 px-3 py-2 rounded font-mono truncate">{f.value}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0"
                        onClick={() => copyText(f.value, f.key)}
                      >
                        {copied === f.key ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Palette Generator */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Color Palette
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PaletteSection title="Complementary" colors={[result.formats.hex, result.palette.complementary]} />
                <PaletteSection title="Analogous" colors={[result.palette.analogous[1], result.formats.hex, result.palette.analogous[0]]} />
                <PaletteSection title="Triadic" colors={[result.formats.hex, ...result.palette.triadic]} />
                <PaletteSection title="Split-Complementary" colors={[result.formats.hex, ...result.palette.split_complementary]} />
              </CardContent>
            </Card>

            {/* Raw JSON */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Raw JSON</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => copyText(JSON.stringify(result, null, 2), 'json')}>
                    {copied === 'json' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}

        {/* API Section */}
        <Separator className="my-8" />

        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-[#17457c] hover:text-[#17457c]/80 mb-4">
            <ChevronDown className="w-4 h-4" />
            Try it via API
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label className="text-xs text-gray-500">Endpoint</Label>
                  <code className="block text-sm bg-gray-100 p-2 rounded mt-1">POST /api/v1/tools/color-convert</code>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">cURL</Label>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs mt-1 overflow-x-auto">
{`curl -X POST https://search.venym.io/api/v1/tools/color-convert \\
  -H "Content-Type: application/json" \\
  -d '{"color": "#17457c"}'`}
                  </pre>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Python</Label>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs mt-1 overflow-x-auto">
{`import requests
res = requests.post(
  "https://search.venym.io/api/v1/tools/color-convert",
  json={"color": "#17457c"}
)
data = res.json()
print(data["formats"]["hex"])   # #17457c
print(data["formats"]["hsl"])   # {h: 210, s: 68, l: 29}
print(data["palette"]["complementary"])`}
                  </pre>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">JavaScript</Label>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs mt-1 overflow-x-auto">
{`const res = await fetch(
  "https://search.venym.io/api/v1/tools/color-convert",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ color: "#17457c" })
  }
);
const data = await res.json();
console.log(data.formats.hsl);`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Powered by <a href="https://search.venym.io" className="text-[#17457c] font-semibold hover:underline">Venym Search</a> APIs — Free developer tools, no auth required
          </p>
        </div>
      </div>
    </div>
  )
}
