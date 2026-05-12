'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white">
      <h1 className="text-8xl font-black tracking-tighter">404</h1>
      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-600 mt-4">
        Page not found
      </p>
      <Link href="/" className="venym-btn-secondary mt-8">BACK HOME</Link>
    </div>
  )
}
