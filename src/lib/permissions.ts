export type PermissionAction = 'create' | 'read' | 'update' | 'delete';
export type PermissionModule = 'users' | 'roles' | 'settings' | 'reports' | 'calendar' | 'notifications';

export interface PermissionGroup {
  module: PermissionModule;
  permissions: {
    id: string;
    name: string;
    description: string;
    action: PermissionAction;
  }[];
}

export const groupPermissionsByModule = (permissions: any[]): PermissionGroup[] => {
  const grouped = permissions.reduce((acc: { [key: string]: any[] }, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {});

  return Object.entries(grouped).map(([module, permissions]) => ({
    module: module as PermissionModule,
    permissions: permissions.sort((a, b) => a.name.localeCompare(b.name)),
  }));
};

export const getPermissionLabel = (action: PermissionAction, module: string): string => {
  const formattedModule = module.replace(/_/g, ' ');
  return `Can ${action} ${formattedModule}`;
};

export const getPermissionDescription = (action: PermissionAction, module: string): string => {
  const actions = {
    create: 'create new',
    read: 'view existing',
    update: 'modify existing',
    delete: 'remove existing',
  };
  
  const formattedModule = module.replace(/_/g, ' ');
  return `Allows user to ${actions[action]} ${formattedModule}`;
};