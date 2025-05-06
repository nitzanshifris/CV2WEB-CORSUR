-- Create trigger to automatically create profile when user is created
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_profile_on_user_creation
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile(); 