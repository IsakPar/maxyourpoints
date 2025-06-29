import { redirect } from 'next/navigation'
import { requireCMSAccess } from '@/lib/auth'
import AdminNavbar from './components/AdminNavbar'
import { ToastProvider } from '@/components/ui/toast-provider'
import { Toaster } from 'sonner'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // PHASE 1: Authentication check - now properly handles session timeout
  let user
  
  try {
    user = await requireCMSAccess()
  } catch (error) {
    console.log('❌ Admin layout: Authentication failed, redirecting to login')
    redirect('/login?error=unauthorized')
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Admin-specific layout with clear separation */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Admin Portal - Max Your Points CMS</span>
            </div>
          </div>
        </div>
        <AdminNavbar user={user} />
        <main className="container mx-auto px-4 py-12">
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