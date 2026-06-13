'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, AlertCircle } from 'lucide-react'
import { fetchAPI } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@urbanflow.in')
  const [password, setPassword] = useState('Admin@123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">UrbanFlow</h1>
            <p className="text-gray-500 text-xs">Urban Intelligence Platform</p>
          </div>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8">
          <h2 className="text-white font-semibold text-lg mb-1">Sign in</h2>
          <p className="text-gray-500 text-sm mb-6">Access the urban command center</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-xs mb-3">Demo accounts:</p>
            <div className="space-y-2">
              {[
                { email: 'admin@urbanflow.in', password: 'Admin@123', role: 'Super Admin' },
                { email: 'planner@delhi.gov.in', password: 'Planner@123', role: 'Urban Planner' },
                { email: 'analyst@urbanflow.in', password: 'Analyst@123', role: 'Analyst' },
              ].map(demo => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => { setEmail(demo.email); setPassword(demo.password) }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors border border-gray-800"
                >
                  <p className="text-gray-300 text-xs font-medium">{demo.role}</p>
                  <p className="text-gray-500 text-xs">{demo.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
