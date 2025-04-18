
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { HomeIcon } from 'lucide-react';

// Mapping from paths to readable names
const pathNameMap: Record<string, string> = {
  'admin': 'Admin',
  'dashboard': 'Dashboard',
  'users': 'User Management',
  'user-groups': 'User Groups',
  'roles': 'Roles & Permissions',
  'menu-visibility': 'Menu Visibility',
  'activity-log': 'Activity Log',
  'state-holidays': 'State Holidays',
  'organizations': 'Organizations',
  'settings': 'Settings',
  'notifications': 'Notifications',
  'profile': 'Profile'
};

const getPathName = (path: string): string => {
  return pathNameMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
};

const PageBreadcrumb: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Skip breadcrumb for dashboard
  if (pathname === '/admin/dashboard') {
    return null;
  }

  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <div className="px-8 py-2 bg-white dark:bg-gray-900">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">
              <HomeIcon className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {pathSegments.map((segment, index) => {
            const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
            const isLast = index === pathSegments.length - 1;

            return [
              isLast ? (
                <BreadcrumbItem key={path}>
                  <BreadcrumbPage>{getPathName(segment)}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem key={path}>
                  <BreadcrumbLink href={path}>{getPathName(segment)}</BreadcrumbLink>
                </BreadcrumbItem>
              ),
              !isLast && <BreadcrumbSeparator key={`${path}-sep`} />
            ];
          })}

        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default PageBreadcrumb;
