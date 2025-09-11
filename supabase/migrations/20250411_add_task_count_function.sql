
-- Create a secure function to get task counts for a user
CREATE OR REPLACE FUNCTION public.get_user_task_counts(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  completed_count INTEGER;
  in_progress_count INTEGER;
  result JSON;
BEGIN
  -- Count completed tasks
  SELECT COUNT(*) INTO completed_count
  FROM public.tasks
  WHERE assigned_to = user_id AND status = 'completed';
  
  -- Count in-progress tasks
  SELECT COUNT(*) INTO in_progress_count
  FROM public.tasks
  WHERE assigned_to = user_id AND (status = 'in_progress' OR status = 'in-progress');
  
  -- Construct the result JSON
  SELECT json_build_object(
    'completed', completed_count,
    'in_progress', in_progress_count
  ) INTO result;
  
  RETURN result;
END;
$$;
