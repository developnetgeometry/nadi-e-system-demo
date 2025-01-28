-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_types enum
CREATE TYPE user_type AS ENUM (
  'member',
  'vendor',
  'tp',
  'sso',
  'dusp',
  'super_admin',
  'medical_office',
  'staff_internal',
  'staff_external'
);

-- Create profiles table with user type
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  ic_number TEXT UNIQUE,
  phone_number TEXT UNIQUE,
  user_type user_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  module TEXT NOT NULL,
  action TEXT NOT NULL DEFAULT 'read',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (role_id, permission_id)
);

-- Create user_roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (user_id, role_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admins can manage roles" ON roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage permissions" ON permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage role permissions" ON role_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage user roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'super_admin'
    )
  );

-- Insert granular permissions for each module
INSERT INTO permissions (name, description, module, action) VALUES
  -- Users module
  ('create_users', 'Create new user accounts', 'users', 'create'),
  ('view_users', 'View user accounts', 'users', 'read'),
  ('update_users', 'Update user accounts', 'users', 'update'),
  ('delete_users', 'Delete user accounts', 'users', 'delete'),
  
  -- Roles module
  ('create_roles', 'Create new roles', 'roles', 'create'),
  ('view_roles', 'View roles', 'roles', 'read'),
  ('update_roles', 'Update roles', 'roles', 'update'),
  ('delete_roles', 'Delete roles', 'roles', 'delete'),
  
  -- Settings module
  ('view_settings', 'View system settings', 'settings', 'read'),
  ('update_settings', 'Modify system settings', 'settings', 'update'),
  
  -- Reports module
  ('create_reports', 'Create new reports', 'reports', 'create'),
  ('view_reports', 'View reports', 'reports', 'read'),
  ('export_reports', 'Export reports', 'reports', 'update'),
  ('delete_reports', 'Delete reports', 'reports', 'delete'),
  
  -- Calendar module
  ('create_events', 'Create calendar events', 'calendar', 'create'),
  ('view_calendar', 'View calendar', 'calendar', 'read'),
  ('update_events', 'Update calendar events', 'calendar', 'update'),
  ('delete_events', 'Delete calendar events', 'calendar', 'delete'),
  
  -- Notifications module
  ('create_notifications', 'Create notifications', 'notifications', 'create'),
  ('view_notifications', 'View notifications', 'notifications', 'read'),
  ('update_notifications', 'Update notifications', 'notifications', 'update'),
  ('delete_notifications', 'Delete notifications', 'notifications', 'delete')
ON CONFLICT (name) DO NOTHING;

-- Insert default super admin role
INSERT INTO roles (name, description) VALUES
  ('super_admin', 'Full system access with all permissions');

-- Assign all permissions to super admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'super_admin'),
  id
FROM permissions;