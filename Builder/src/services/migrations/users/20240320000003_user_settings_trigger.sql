-- Create trigger to automatically create settings when user is created
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_settings_on_user_creation
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_settings(); 