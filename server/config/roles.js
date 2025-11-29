const roles = {
  admin: {
    permissions: [
      // User Management
      'users:list',
      'users:view',
      'users:create',
      'users:update',
      'users:delete',
      
      // Content Management (Blog, Portfolio, etc.)
      'content:list',
      'content:view',
      'content:create',
      'content:update',
      'content:delete',
      
      // Services Management
      'services:list',
      'services:view',
      'services:create',
      'services:update',
      'services:delete',

      // Team Management
      'team:list',
      'team:view',
      'team:create',
      'team:update',
      'team:delete',
      
      // Reviews Management
      'reviews:list',
      'reviews:view',
      'reviews:update',
      'reviews:delete',

      // Contacts Management
      'contacts:list',
      'contacts:view',
      'contacts:delete',

      // Orders Management
      'orders:list',
      'orders:view',
      'orders:update',
      'orders:delete',

      // Admin Dashboard & Settings
      'dashboard:view',
      'settings:view',
      'settings:update',
      'billing:view',
      'billing:update',
      'marketing:view',
      'marketing:update'
    ],
  },
  manager: {
    permissions: [
      // Content Management (Full)
      'content:list',
      'content:view',
      'content:create',
      'content:update',
      'content:delete',

      // Services Management (Full)
      'services:list',
      'services:view',
      'services:create',
      'services:update',
      'services:delete',
      
      // Team Management (Full)
      'team:list',
      'team:view',
      'team:create',
      'team:update',
      'team:delete',
      
      // Reviews Management (Full)
      'reviews:list',
      'reviews:view',
      'reviews:update',
      'reviews:delete',
      
      // Contacts Management (Full)
      'contacts:list',
      'contacts:view',
      'contacts:delete',

      // Orders Management (Full)
      'orders:list',
      'orders:view',
      'orders:update',
      'orders:delete',
      
      // Admin Dashboard & Settings (Full access except billing)
      'dashboard:view',
      'settings:view',
      'settings:update',
      'marketing:view',
      'marketing:update'
      
      // Excluded: users:*, billing:* (admin only)
    ],
  },
  customer: {
    permissions: [],
  },
  user: {
    permissions: [],
  },
};

const hasPermission = (role, permission) => {
  if (!roles[role]) {
    return false;
  }
  // Admins can do anything
  if (role === 'admin') {
    return true;
  }
  return roles[role].permissions.includes(permission);
};

module.exports = {
  roles,
  hasPermission,
}; 