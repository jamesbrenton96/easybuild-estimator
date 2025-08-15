-- Create enum for project types
CREATE TYPE public.project_type AS ENUM (
  'residential_construction',
  'commercial_construction', 
  'renovation',
  'landscaping',
  'other'
);

-- Create enum for estimate status
CREATE TYPE public.estimate_status AS ENUM (
  'pending',
  'processing', 
  'completed',
  'failed'
);

-- Create table for project submissions
CREATE TABLE public.project_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic project info
  project_name TEXT,
  project_type project_type,
  description TEXT,
  
  -- Location and dimensions
  location_details JSONB,
  dimensions JSONB,
  
  -- Materials and specifications
  materials JSONB,
  finish_details JSONB,
  
  -- Timeline and budget
  timeframe JSONB,
  rates JSONB,
  margin JSONB,
  
  -- Additional work and notes
  additional_work JSONB,
  notes TEXT,
  
  -- Correspondence details
  correspondence JSONB,
  
  -- Processing status
  status estimate_status DEFAULT 'pending',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for uploaded files
CREATE TABLE public.project_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES public.project_submissions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- File details
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  
  -- Metadata
  upload_completed BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for generated estimates
CREATE TABLE public.estimates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES public.project_submissions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Estimate content
  markdown_content TEXT,
  structured_data JSONB,
  
  -- Processing details
  processing_time_ms INTEGER,
  llm_model TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for project_submissions
CREATE POLICY "Users can create their own submissions" 
ON public.project_submissions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own submissions" 
ON public.project_submissions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" 
ON public.project_submissions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for project_files
CREATE POLICY "Users can upload their own files" 
ON public.project_files 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own files" 
ON public.project_files 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own files" 
ON public.project_files 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for estimates
CREATE POLICY "Users can view their own estimates" 
ON public.estimates 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', false);

-- Create storage policies for project files
CREATE POLICY "Users can upload their own project files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own project files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own project files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own project files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_project_submissions_updated_at
BEFORE UPDATE ON public.project_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();