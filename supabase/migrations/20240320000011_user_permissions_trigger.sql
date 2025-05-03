-- Create function to handle new user permissions
CREATE OR REPLACE FUNCTION public.handle_new_user_permissions()
RETURNS TRIGGER AS $$
BEGIN
  -- Assign default user permission to new users
  INSERT INTO public.user_permissions (user_id, permission_id)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user permissions
CREATE TRIGGER on_profile_created_permissions
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_permissions(); 