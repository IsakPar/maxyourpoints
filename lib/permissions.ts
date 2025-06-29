import { AuthUser } from '@/lib/auth'

export type Permission = 
  // Article permissions
  | 'articles:read'
  | 'articles:create'
  | 'articles:edit'
  | 'articles:delete'
  | 'articles:publish'
  
  // User management permissions
  | 'users:read'
  | 'users:create'
  | 'users:edit'
  | 'users:delete'
  
  // Media permissions
  | 'media:read'
  | 'media:upload'
  | 'media:edit'
  | 'media:delete'
  
  // Analytics permissions (future)
  | 'analytics:read'
  
  // Category permissions
  | 'categories:read'
  | 'categories:manage'

// Role definitions with their permissions
const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  'admin': [
    // Full access to everything
    'articles:read',
    'articles:create', 
    'articles:edit',
    'articles:delete',
    'articles:publish',
    'users:read',
    'users:create',
    'users:edit', 
    'users:delete',
    'media:read',
    'media:upload',
    'media:edit',
    'media:delete',
    'analytics:read',
    'categories:read',
    'categories:manage'
  ],
  
  'super_admin': [
    // Same as admin (legacy support)
    'articles:read',
    'articles:create', 
    'articles:edit',
    'articles:delete',
    'articles:publish',
    'users:read',
    'users:create',
    'users:edit', 
    'users:delete',
    'media:read',
    'media:upload',
    'media:edit',
    'media:delete',
    'analytics:read',
    'categories:read',
    'categories:manage'
  ],
  
  'editor': [
    // Can manage articles and media, but no user access or analytics
    'articles:read',
    'articles:create',
    'articles:edit', 
    'articles:delete',
    'articles:publish',
    'media:read',
    'media:upload',
    'media:edit',
    'media:delete',
    'categories:read'
  ],
  
  'viewer': [
    // Read-only access - can explore but not save/publish
    'articles:read',
    'users:read',
    'media:read',
    'categories:read'
  ],
  
  'author': [
    // Can create and edit own articles
    'articles:read',
    'articles:create',
    'articles:edit',
    'media:read',
    'media:upload',
    'categories:read'
  ],
  
  'subscriber': [
    // Very limited access
    'articles:read'
  ]
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: AuthUser | null, permission: Permission): boolean {
  if (!user || !user.role) return false
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || []
  return userPermissions.includes(permission)
}

/**
 * Check if a user has ANY of the specified permissions
 */
export function hasAnyPermission(user: AuthUser | null, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(user, permission))
}

/**
 * Check if a user has ALL of the specified permissions
 */
export function hasAllPermissions(user: AuthUser | null, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(user, permission))
}

/**
 * Get all permissions for a user's role
 */
export function getUserPermissions(user: AuthUser | null): Permission[] {
  if (!user || !user.role) return []
  return ROLE_PERMISSIONS[user.role] || []
}

/**
 * Check if user can access admin panel at all
 */
export function canAccessAdmin(user: AuthUser | null): boolean {
  return hasAnyPermission(user, [
    'articles:read',
    'users:read', 
    'media:read',
    'analytics:read'
  ])
}

/**
 * Get user-friendly role display name
 */
export function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    'admin': 'Administrator',
    'super_admin': 'Super Admin',
    'editor': 'Editor',
    'viewer': 'Viewer',
    'author': 'Author',
    'subscriber': 'Subscriber'
  }
  return roleNames[role] || role
}

/**
 * Navigation items with permission requirements
 */
export const ADMIN_NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: '📊',
    requiredPermissions: ['articles:read'] as Permission[]
  },
  {
    name: 'Articles',
    href: '/admin/articles',
    icon: '📝',
    requiredPermissions: ['articles:read'] as Permission[]
  },
  {
    name: 'Categories',
    href: '/admin/categories',
    icon: '📁',
    requiredPermissions: ['categories:read'] as Permission[]
  },
  {
    name: 'Media',
    href: '/admin/media',
    icon: '🖼️',
    requiredPermissions: ['media:read'] as Permission[]
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: '👥',
    requiredPermissions: ['users:read'] as Permission[]
  },
  {
    name: 'Newsletter',
    href: '/admin/newsletter',
    icon: '📧',
    requiredPermissions: ['analytics:read'] as Permission[]
  },
  {
    name: 'WordPress Migration',
    href: '/admin/wordpress-migration',
    icon: '⬆️',
    requiredPermissions: ['users:create'] as Permission[]
  }
]

/**
 * Filter navigation items based on user permissions
 */
export function getAvailableNavItems(user: AuthUser | null) {
  return ADMIN_NAV_ITEMS.filter(item => 
    hasAnyPermission(user, item.requiredPermissions)
  )
} 