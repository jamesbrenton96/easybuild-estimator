import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface SubmissionData {
  projectName?: string;
  projectType?: string;
  description?: string;
  locationDetails?: any;
  dimensions?: any;
  materials?: any;
  finishDetails?: any;
  timeframe?: any;
  rates?: any;
  margin?: any;
  additionalWork?: any;
  notes?: string;
  correspondence?: any;
  files?: File[];
}

export const useSupabaseSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();

  const submitProjectData = async (data: SubmissionData) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // 1. Create project submission
      const { data: submission, error: submissionError } = await supabase
        .from('project_submissions')
        .insert({
          project_name: data.projectName,
          project_type: data.projectType as 'residential_construction' | 'commercial_construction' | 'renovation' | 'landscaping' | 'other',
          description: data.description,
          location_details: data.locationDetails,
          dimensions: data.dimensions,
          materials: data.materials,
          finish_details: data.finishDetails,
          timeframe: data.timeframe,
          rates: data.rates,
          margin: data.margin,
          additional_work: data.additionalWork,
          notes: data.notes,
          correspondence: data.correspondence,
          status: 'pending'
        })
        .select()
        .single();

      if (submissionError) {
        throw new Error(`Failed to create submission: ${submissionError.message}`);
      }

      const submissionId = submission.id;
      setUploadProgress(25);

      // 2. Upload files if any
      if (data.files && data.files.length > 0) {
        await uploadFiles(data.files, submissionId, user.id);
      }

      setUploadProgress(75);

      // 3. Generate estimate
      const { data: authData } = await supabase.auth.getSession();
      if (!authData.session) {
        throw new Error('No valid session');
      }

      const { data: estimateResponse, error: estimateError } = await supabase.functions.invoke(
        'generate-estimate',
        {
          body: { submissionId },
          headers: {
            Authorization: `Bearer ${authData.session.access_token}`,
          },
        }
      );

      if (estimateError) {
        throw new Error(`Failed to generate estimate: ${estimateError.message}`);
      }

      if (!estimateResponse.success) {
        throw new Error(estimateResponse.error || 'Failed to generate estimate');
      }

      setUploadProgress(100);

      return {
        submissionId,
        estimateId: estimateResponse.estimate.id,
        markdownContent: estimateResponse.estimate.markdownContent,
        processingTime: estimateResponse.estimate.processingTime
      };

    } catch (error) {
      console.error('Submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadFiles = async (files: File[], submissionId: string, userId: string) => {
    const uploadPromises = files.map(async (file, index) => {
      try {
        // Create unique file path with user ID
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${submissionId}/${Date.now()}_${index}.${fileExt}`;

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(fileName, file);

        if (uploadError) {
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }

        // Save file metadata to database
        const { error: fileRecordError } = await supabase
          .from('project_files')
          .insert({
            submission_id: submissionId,
            user_id: userId,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            storage_path: uploadData.path,
            upload_completed: true
          });

        if (fileRecordError) {
          console.error(`Failed to save file record for ${file.name}:`, fileRecordError);
          // Don't throw here as file was uploaded successfully
        }

        return uploadData;
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        throw error;
      }
    });

    await Promise.all(uploadPromises);
  };

  const getSubmission = async (submissionId: string) => {
    const { data: submission, error } = await supabase
      .from('project_submissions')
      .select(`
        *,
        project_files(*),
        estimates(*)
      `)
      .eq('id', submissionId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch submission: ${error.message}`);
    }

    return submission;
  };

  const getUserSubmissions = async () => {
    if (!user) return [];

    const { data: submissions, error } = await supabase
      .from('project_submissions')
      .select(`
        *,
        project_files(*),
        estimates(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch user submissions:', error);
      return [];
    }

    return submissions;
  };

  return {
    isSubmitting,
    uploadProgress,
    submitProjectData,
    getSubmission,
    getUserSubmissions
  };
};