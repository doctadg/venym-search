'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSignIn, useUser } from '@clerk/nextjs'
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const { user } = useUser()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || !signIn) return

    setError('')
    setLoading(true)

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })

        await fetch('/api/auth/sync-user', {
          method: 'POST'
        })

        router.push('/dashboard')
      } else {
        setError('Sign-in incomplete. Please check your credentials.')
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'An error occurred during sign-in')
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl">
        <div className="flex h-14 items-center px-4 md:px-6 gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.15em] text-white/40 hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>

          <Link href="/" className="flex items-center gap-3 mx-auto">
            <div className="w-7 h-7 relative">
              <Image
                src="/VENYM_SEARCH-logo.png"
                alt="Venym Search"
                width={28}
                height={28}
                className="w-7 h-7"
              />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-white">
              Venym Search
            </span>
            <span className="hidden sm:inline-flex text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 border border-white/10 px-2 py-0.5 rounded-sm">
              Sign In
            </span>
          </Link>

          <div className="w-16" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="venym-meta mb-3">CLASS :: AUTHENTICATION</div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h1>
            <p className="mt-2 text-[13px] text-white/50">
              Sign in to your Venym Search account
            </p>
          </div>

          <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/30"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 rounded-sm transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-[10px] font-mono uppercase tracking-[0.2em] text-white/30"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 px-3 bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 rounded-sm transition-colors"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-white/[0.03] border border-white/[0.10] rounded-sm">
                  <AlertCircle className="h-3.5 w-3.5 text-white/60 shrink-0" />
                  <span className="text-white/70 text-[12px] font-mono">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="venym-btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                    Signing In
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="pt-6 border-t border-white/[0.06] text-center">
                <p className="text-[12px] text-white/40">
                  Don't have an account?{' '}
                  <Link
                    href="/signup"
                    className="text-white/80 hover:text-white transition-colors font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
