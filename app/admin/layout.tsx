import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import AdminNavbar from './components/AdminNavbar'
import { ToastProvider } from '@/components/ui/toast-provider'
import { Toaster } from 'sonner'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication using Supabase Auth
  const user = await getAuthUser()

  // If no user or not admin/super_admin, redirect to login
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    redirect('/login?error=unauthorized')
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar user={user} />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster 
          position="top-right"
          expand={true}
          richColors={true}
        />
      </div>
    </ToastProvider>
  )
} 