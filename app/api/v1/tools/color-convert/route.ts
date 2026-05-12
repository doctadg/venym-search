import { NextRequest, NextResponse } from 'next/server'

// Named color database (CSS named colors)
const NAMED_COLORS: Record<string, [number, number, number]> = {
  aliceblue: [240, 248, 255], antiquewhite: [250, 235, 215], aqua: [0, 255, 255],
  aquamarine: [127, 255, 212], azure: [240, 255, 255], beige: [245, 245, 220],
  bisque: [255, 228, 196], black: [0, 0, 0], blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255], blueviolet: [138, 43, 226], brown: [165, 42, 42],
  burlywood: [222, 184, 135], cadetblue: [95, 158, 160], chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30], coral: [255, 127, 80], cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220], crimson: [220, 20, 60], cyan: [0, 255, 255],
  darkblue: [0, 0, 139], darkcyan: [0, 139, 139], darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169], darkgreen: [0, 100, 0], darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139], darkolivegreen: [85, 107, 47], darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204], darkred: [139, 0, 0], darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143], darkslateblue: [72, 61, 139], darkslategray: [47, 79, 79],
  darkturquoise: [0, 206, 209], darkviolet: [148, 0, 211], deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255], dimgray: [105, 105, 105], dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34], floralwhite: [255, 250, 240], forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255], gainsboro: [220, 220, 220], ghostwhite: [248, 248, 255],
  gold: [255, 215, 0], goldenrod: [218, 165, 32], gray: [128, 128, 128],
  green: [0, 128, 0], greenyellow: [173, 255, 47], honeydew: [240, 255, 240],
  hotpink: [255, 105, 180], indianred: [205, 92, 92], indigo: [75, 0, 130],
  ivory: [255, 255, 240], khaki: [240, 230, 140], lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245], lawngreen: [124, 252, 0], lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230], lightcoral: [240, 128, 128], lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210], lightgray: [211, 211, 211], lightgreen: [144, 238, 144],
  lightpink: [255, 182, 193], lightsalmon: [255, 160, 122], lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250], lightslategray: [119, 136, 153], lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224], lime: [0, 255, 0], limegreen: [50, 205, 50],
  linen: [250, 240, 230], magenta: [255, 0, 255], maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170], mediumblue: [0, 0, 205], mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219], mediumseagreen: [60, 179, 113], mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154], mediumturquoise: [72, 209, 204], mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112], mintcream: [245, 255, 250], mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181], navajowhite: [255, 222, 173], navy: [0, 0, 128],
  oldlace: [253, 245, 230], olive: [128, 128, 0], olivedrab: [107, 142, 35],
  orange: [255, 165, 0], orangered: [255, 69, 0], orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170], palegreen: [152, 251, 152], paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147], papayawhip: [255, 239, 213], peachpuff: [255, 218, 185],
  peru: [205, 133, 63], pink: [255, 192, 203], plum: [221, 160, 221],
  powderblue: [176, 224, 230], purple: [128, 0, 128], rebeccapurple: [102, 51, 153],
  red: [255, 0, 0], rosybrown: [188, 143, 143], royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19], salmon: [250, 128, 114], sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87], seashell: [255, 245, 238], sienna: [160, 82, 45],
  silver: [192, 192, 192], skyblue: [135, 206, 235], slateblue: [106, 90, 205],
  slategray: [112, 128, 144], snow: [255, 250, 250], springgreen: [0, 255, 127],
  steelblue: [70, 130, 180], tan: [210, 180, 140], teal: [0, 128, 128],
  thistle: [216, 191, 216], tomato: [255, 99, 71], turquoise: [64, 224, 208],
  violet: [238, 130, 238], wheat: [245, 222, 179], white: [255, 255, 255],
  whitesmoke: [245, 245, 245], yellow: [255, 255, 0], yellowgreen: [154, 205, 50],
}

function parseColor(input: string): { r: number; g: number; b: number; format: string } | null {
  const trimmed = input.trim()

  // Hex: #fff or #ffffff or #ffffffff (with alpha)
  const hexMatch = trimmed.match(/^#([0-9a-f]{3,8})$/i)
  if (hexMatch) {
    let hex = hexMatch[1]
    let alpha = 1
    if (hex.length === 4) {
      const r = parseInt(hex[0] + hex[0], 16)
      const g = parseInt(hex[1] + hex[1], 16)
      const b = parseInt(hex[2] + hex[2], 16)
      return { r, g, b, format: 'hex' }
    } else if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return { r, g, b, format: 'hex' }
    } else if (hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      void alpha // ignore alpha for basic conversion
      return { r, g, b, format: 'hex' }
    }
  }

  // rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = trimmed.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i)
  if (rgbMatch) {
    const r = Math.min(255, parseInt(rgbMatch[1], 10))
    const g = Math.min(255, parseInt(rgbMatch[2], 10))
    const b = Math.min(255, parseInt(rgbMatch[3], 10))
    return { r, g, b, format: 'rgb' }
  }

  // hsl(h, s%, l%) or hsla(h, s%, l%, a)
  const hslMatch = trimmed.match(/hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?/i)
  if (hslMatch) {
    const h = parseInt(hslMatch[1], 10) % 360
    const s = parseInt(hslMatch[2], 10) / 100
    const l = parseInt(hslMatch[3], 10) / 100
    const rgb = hslToRgb(h, s, l)
    return { ...rgb, format: 'hsl' }
  }

  // Named color
  const lower = trimmed.toLowerCase().replace(/\s/g, '')
  if (NAMED_COLORS[lower]) {
    const [r, g, b] = NAMED_COLORS[lower]
    return { r, g, b, format: 'named' }
  }

  return null
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

function luminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { color } = body

    if (!color || typeof color !== 'string') {
      return NextResponse.json({ error: 'color string is required' }, { status: 400 })
    }

    const parsed = parseColor(color)
    if (!parsed) {
      return NextResponse.json({
        error: 'Could not parse color. Supported formats: hex (#fff, #ffffff), rgb(r,g,b), hsl(h,s%,l%), named colors (red, blue, etc.)',
      }, { status: 400 })
    }

    const { r, g, b, format } = parsed
    const hex = rgbToHex(r, g, b)
    const hsl = rgbToHsl(r, g, b)
    const rgba = `rgba(${r}, ${g}, ${b}, 1)`
    const hsla = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`

    // Contrast checker
    const lum = luminance(r, g, b)
    const whiteContrast = contrastRatio(1, lum)
    const blackContrast = contrastRatio(lum, 0)

    // Palette generation
    const palette = {
      complementary: hslToRgb((hsl.h + 180) % 360, hsl.s / 100, hsl.l / 100),
      analogous: [
        hslToRgb((hsl.h + 30) % 360, hsl.s / 100, hsl.l / 100),
        hslToRgb((hsl.h - 30 + 360) % 360, hsl.s / 100, hsl.l / 100),
      ],
      triadic: [
        hslToRgb((hsl.h + 120) % 360, hsl.s / 100, hsl.l / 100),
        hslToRgb((hsl.h + 240) % 360, hsl.s / 100, hsl.l / 100),
      ],
      split_complementary: [
        hslToRgb((hsl.h + 150) % 360, hsl.s / 100, hsl.l / 100),
        hslToRgb((hsl.h + 210) % 360, hsl.s / 100, hsl.l / 100),
      ],
    }

    return NextResponse.json({
      input: color,
      detected_format: format,
      formats: {
        hex,
        rgb: { r, g, b },
        hsl,
        rgba,
        hsla,
      },
      contrast: {
        white_text: {
          ratio: Math.round(whiteContrast * 100) / 100,
          aa_normal: whiteContrast >= 4.5,
          aa_large: whiteContrast >= 3,
          aaa_normal: whiteContrast >= 7,
          aaa_large: whiteContrast >= 4.5,
        },
        black_text: {
          ratio: Math.round(blackContrast * 100) / 100,
          aa_normal: blackContrast >= 4.5,
          aa_large: blackContrast >= 3,
          aaa_normal: blackContrast >= 7,
          aaa_large: blackContrast >= 4.5,
        },
      },
      palette: {
        complementary: rgbToHex(palette.complementary.r, palette.complementary.g, palette.complementary.b),
        analogous: palette.analogous.map(c => rgbToHex(c.r, c.g, c.b)),
        triadic: palette.triadic.map(c => rgbToHex(c.r, c.g, c.b)),
        split_complementary: palette.split_complementary.map(c => rgbToHex(c.r, c.g, c.b)),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
