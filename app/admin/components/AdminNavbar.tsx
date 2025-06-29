'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { getAvailableNavItems, getRoleDisplayName } from '@/lib/permissions'
import { AuthUser } from '@/lib/auth'

interface AdminNavbarProps {
  user?: AuthUser | null
}

export default function AdminNavbar({ user }: AdminNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  // Get navigation items based on user permissions
  const availableNavItems = getAvailableNavItems(user || null)

  const handleLogout = async () => {
    try {
      console.log('🔓 Signing out...')
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b-2 border-emerald-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin" className="text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                Dashboard
              </Link>
            </div>
            <div className="hidden md:ml-12 md:flex md:space-x-1">
              {availableNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    item.href === '/admin' 
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  }
                >
                  {item.icon} {item.name}
                </Link>
              ))}
              {/* Show coming soon only for admins */}
              {user?.role === 'admin' || user?.role === 'super_admin' ? (
                <div className="text-gray-400 hover:text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                  📈 Analytics (Coming Soon)
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="text-emerald-600 font-medium">Session timeout:</span> 15 minutes
            </div>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 hover:bg-emerald-50 p-2 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-medium text-gray-900">{user?.name || user?.email?.split('@')[0]}</div>
                  <div className="text-xs text-emerald-600 uppercase font-medium">{user?.role ? getRoleDisplayName(user.role) : 'USER'}</div>
                </div>
              </button>
              {isMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-4 text-white">
                    <div className="font-medium">{user?.name || user?.email}</div>
                    <div className="text-xs text-emerald-100 uppercase font-medium">{user?.role ? getRoleDisplayName(user.role) : 'USER'} ACCESS</div>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                    >
                      🚪 Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 