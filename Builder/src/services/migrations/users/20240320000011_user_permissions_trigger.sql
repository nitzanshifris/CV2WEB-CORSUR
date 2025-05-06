-- Create trigger to automatically assign basic user permission
CREATE OR REPLACE FUNCTION assign_basic_user_permission()
RETURNS TRIGGER AS $$
DECLARE
  basic_permission_id UUID;
BEGIN
  SELECT id INTO basic_permission_id
  FROM permissions
  WHERE name = 'user';

  INSERT INTO user_permissions (user_id, permission_id)
  VALUES (NEW.id, basic_permission_id);

  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER assign_basic_permission_on_user_creation
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION assign_basic_user_permission(); 