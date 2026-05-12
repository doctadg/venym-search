import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Color Converter - HEX to RGB, HSL & More Free Online | Venym Search',
  description:
    'Convert colors between HEX, RGB, HSL, RGBA, and HSLA formats. Generate color palettes and check WCAG contrast ratios. Free online color picker and converter — no signup required.',
  openGraph: {
    title: 'Color Converter - HEX to RGB, HSL & More Free Online | Venym Search',
    description:
      'Convert colors between HEX, RGB, HSL, RGBA, and HSLA formats. Generate color palettes and check WCAG contrast ratios. Free — no signup required.',
    type: 'website',
  },
}

export default function ColorConverterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
