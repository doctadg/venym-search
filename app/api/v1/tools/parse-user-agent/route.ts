import { NextRequest, NextResponse } from 'next/server'

interface ParseResult {
  user_agent: string
  browser: { name: string; version: string; engine: string }
  os: { name: string; version: string; platform: string }
  device: { type: string; is_mobile: boolean; is_tablet: boolean; is_desktop: boolean; is_bot: boolean }
}

function parseUserAgent(ua: string): ParseResult {
  const browser = parseBrowser(ua)
  const os = parseOS(ua)
  const device = parseDevice(ua)
  return { user_agent: ua, browser, os, device }
}

function parseBrowser(ua: string) {
  // Bot detection first
  const botPatterns = [
    /Googlebot\/([\d.]+)/i,
    /Bingbot\/([\d.]+)/i,
    /Slurp\/([\d.]+)/i,
    /DuckDuckBot\/([\d.]+)/i,
    /Baiduspider\/([\d.]+)/i,
    /YandexBot\/([\d.]+)/i,
    /facebookexternalhit/i,
    /Twitterbot\/([\d.]+)/i,
    /LinkedInBot\/([\d.]+)/i,
    /Slackbot/i,
    /Discordbot\/([\d.]+)/i,
    /WhatsApp\/([\d.]+)/i,
    /TelegramBot/i,
    /AhrefsBot\/([\d.]+)/i,
    /SemrushBot\/([\d.]+)/i,
    /MJ12bot\/([\d.]+)/i,
    /DotBot\/([\d.]+)/i,
    /crawler/i,
    /spider/i,
    /bot/i,
  ]

  for (const pat of botPatterns) {
    if (pat.test(ua)) {
      const m = ua.match(pat)
      return { name: 'Bot', version: m?.[1] || 'Unknown', engine: 'N/A' }
    }
  }

  let name = 'Unknown'
  let version = ''
  let engine = 'Unknown'

  // Order matters: more specific first
  const browserPatterns: [RegExp, string, string][] = [
    [/OPR\/([\d.]+)/, 'Opera', 'Blink'],
    [/Opera\/([\d.]+)/, 'Opera', 'Blink'],
    [/SamsungBrowser\/([\d.]+)/, 'Samsung Internet', 'Blink'],
    [/Edg\/([\d.]+)/, 'Edge', 'Blink'],
    [/Brave\/([\d.]+)/, 'Brave', 'Blink'],
    [/Vivaldi\/([\d.]+)/, 'Vivaldi', 'Blink'],
    [/YaBrowser\/([\d.]+)/, 'Yandex Browser', 'Blink'],
    [/UCBrowser\/([\d.]+)/, 'UC Browser', 'Blink'],
    [/Firefox\/([\d.]+)/, 'Firefox', 'Gecko'],
    [/FxiOS\/([\d.]+)/, 'Firefox', 'WebKit'],
    [/Chrome\/([\d.]+)/, 'Chrome', 'Blink'],
    [/Version\/([\d.]+).*Safari/, 'Safari', 'WebKit'],
    [/MSIE ([\d.]+)/, 'Internet Explorer', 'Trident'],
    [/Trident\/([\d.]+)/, 'Internet Explorer', 'Trident'],
  ]

  for (const [pattern, bName, bEngine] of browserPatterns) {
    const m = ua.match(pattern)
    if (m) {
      name = bName
      version = m[1]
      engine = bEngine
      break
    }
  }

  // Detect engine independently
  if (/AppleWebKit\//.test(ua)) {
    engine = /Chrome\//.test(ua) ? 'Blink' : 'WebKit'
  } else if (/Gecko\//.test(ua) && !/like Gecko/.test(ua)) {
    engine = 'Gecko'
  } else if (/Trident\//.test(ua)) {
    engine = 'Trident'
  }

  return { name, version, engine }
}

function parseOS(ua: string) {
  let name = 'Unknown'
  let version = ''
  let platform = 'Unknown'

  const osPatterns: [RegExp, string][] = [
    [/Windows NT 10\.0/, 'Windows'],
    [/Windows NT 6\.3/, 'Windows 8.1'],
    [/Windows NT 6\.2/, 'Windows 8'],
    [/Windows NT 6\.1/, 'Windows 7'],
    [/Windows NT 6\.0/, 'Windows Vista'],
    [/Windows NT 5\.1/, 'Windows XP'],
    [/Windows NT/, 'Windows'],
    [/Mac OS X ([\d_]+)/, 'macOS'],
    [/Mac OS/, 'macOS'],
    [/Android ([\d.]+)/, 'Android'],
    [/iPhone OS ([\d_]+)/, 'iOS'],
    [/iPad.*OS ([\d_]+)/, 'iPadOS'],
    [/CrOS/, 'ChromeOS'],
    [/Linux/, 'Linux'],
    [/Ubuntu/, 'Ubuntu'],
    [/Fedora/, 'Fedora'],
    [/Debian/, 'Debian'],
    [/CentOS/, 'CentOS'],
  ]

  for (const [pattern, osName] of osPatterns) {
    const m = ua.match(pattern)
    if (m) {
      name = osName
      version = m[1] ? m[1].replace(/_/g, '.') : ''
      break
    }
  }

  // Platform
  if (/iPhone/.test(ua)) platform = 'iPhone'
  else if (/iPad/.test(ua)) platform = 'iPad'
  else if (/Android/.test(ua)) platform = /Mobile/.test(ua) ? 'Android Mobile' : 'Android Tablet'
  else if (/Macintosh/.test(ua)) platform = 'Mac'
  else if (/Windows/.test(ua)) platform = 'Windows'
  else if (/Linux/.test(ua)) platform = 'Linux'
  else if (/CrOS/.test(ua)) platform = 'Chromebook'

  return { name, version, platform }
}

function parseDevice(ua: string) {
  const isBot = /bot|crawler|spider|slurp/i.test(ua)
  const isMobile = /iPhone|Android.*Mobile|Windows Phone|Opera Mini|Mobile.*Safari/i.test(ua)
  const isTablet = /iPad|Android(?!.*Mobile)|Tablet|Kindle|Silk|PlayBook/i.test(ua) && !isMobile
  const isDesktop = !isMobile && !isTablet && !isBot

  let type = 'Desktop'
  if (isBot) type = 'Bot'
  else if (isMobile) type = 'Mobile'
  else if (isTablet) type = 'Tablet'

  return { type, is_mobile: isMobile, is_tablet: isTablet, is_desktop: isDesktop, is_bot: isBot }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_agent } = body

    if (!user_agent || typeof user_agent !== 'string') {
      return NextResponse.json({ error: 'user_agent string is required' }, { status: 400 })
    }

    if (user_agent.length > 2000) {
      return NextResponse.json({ error: 'user_agent must be under 2000 characters' }, { status: 400 })
    }

    const result = parseUserAgent(user_agent.trim())
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
