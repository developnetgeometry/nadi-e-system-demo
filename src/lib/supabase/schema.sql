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

-- Create notification_type enum
CREATE TYPE notification_type AS ENUM (
  'info',
  'warning',
  'success',
  'error'
);

-- Create profiles table with user type
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  ic_number TEXT UNIQUE,
  phone_number TEXT UNIQUE,
  avatar_url TEXT,
  user_type user_type NOT NULL,
  theme_preference TEXT DEFAULT 'light',
  notification_preferences JSONB DEFAULT '{"email": true, "push": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
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

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create notification policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all notifications" ON notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'super_admin'
    )
  );

-- Create notification function
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type notification_type DEFAULT 'info'
)
RETURNS notifications AS $$
DECLARE
  v_notification notifications;
BEGIN
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (p_user_id, p_title, p_message, p_type)
  RETURNING * INTO v_notification;
  
  RETURN v_notification;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create asset_status enum
CREATE TYPE asset_status AS ENUM (
  'active',
  'in_maintenance',
  'retired',
  'disposed'
);

-- Create asset_category enum
CREATE TYPE asset_category AS ENUM (
  'equipment',
  'furniture',
  'vehicle',
  'electronics',
  'software',
  'other'
);

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category asset_category NOT NULL,
  status asset_status DEFAULT 'active',
  purchase_date DATE NOT NULL,
  purchase_cost DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2),
  depreciation_rate DECIMAL(5,2),
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  location TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create maintenance_records table
CREATE TABLE IF NOT EXISTS maintenance_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  maintenance_date DATE NOT NULL,
  description TEXT NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  performed_by TEXT NOT NULL,
  next_maintenance_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Assets are viewable by authenticated users" ON assets
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can manage assets" ON assets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND (user_type = 'staff_internal' OR user_type = 'super_admin')
    )
  );

CREATE POLICY "Maintenance records are viewable by authenticated users" ON maintenance_records
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can manage maintenance records" ON maintenance_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND (user_type = 'staff_internal' OR user_type = 'super_admin')
    )
  );

-- Update Assets RLS policies to allow anonymous read access
DROP POLICY IF EXISTS "Assets are viewable by authenticated users" ON assets;
CREATE POLICY "Assets are viewable by everyone" ON assets
  FOR SELECT USING (true);

-- Update Maintenance Records RLS policies to allow anonymous read access
DROP POLICY IF EXISTS "Maintenance records are viewable by authenticated users" ON maintenance_records;
CREATE POLICY "Maintenance records are viewable by everyone" ON maintenance_records
  FOR SELECT USING (true);