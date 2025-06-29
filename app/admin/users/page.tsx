import { requireCMSAccess } from '@/lib/auth'
import UsersPageClient from './users-page-client'

export default async function UsersPage() {
  // Get the current user from server-side authentication
  const currentUser = await requireCMSAccess()
  
  return <UsersPageClient currentUser={currentUser} />
} 