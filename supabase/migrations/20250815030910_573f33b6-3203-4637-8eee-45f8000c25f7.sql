-- Add missing RLS policies for estimates table
-- Users can only insert estimates for their own submissions
CREATE POLICY "Users can create estimates for their own submissions" 
ON public.estimates 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM public.project_submissions 
    WHERE id = estimates.submission_id AND user_id = auth.uid()
  )
);

-- Users can update their own estimates
CREATE POLICY "Users can update their own estimates" 
ON public.estimates 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own estimates
CREATE POLICY "Users can delete their own estimates" 
ON public.estimates 
FOR DELETE 
USING (auth.uid() = user_id);