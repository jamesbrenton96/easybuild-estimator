import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { submissionId } = await req.json();
    
    if (!submissionId) {
      throw new Error('Submission ID is required');
    }

    console.log(`Processing estimate for submission: ${submissionId}`);

    // Update submission status to processing
    await supabaseClient
      .from('project_submissions')
      .update({ status: 'processing' })
      .eq('id', submissionId)
      .eq('user_id', user.id);

    // Get submission data
    const { data: submission, error: submissionError } = await supabaseClient
      .from('project_submissions')
      .select('*')
      .eq('id', submissionId)
      .eq('user_id', user.id)
      .single();

    if (submissionError || !submission) {
      throw new Error('Submission not found');
    }

    // Get associated files
    const { data: files, error: filesError } = await supabaseClient
      .from('project_files')
      .select('*')
      .eq('submission_id', submissionId)
      .eq('user_id', user.id);

    if (filesError) {
      console.error('Error fetching files:', filesError);
    }

    // Format submission data for estimate generation
    const projectData = {
      projectName: submission.project_name,
      projectType: submission.project_type,
      description: submission.description,
      locationDetails: submission.location_details,
      dimensions: submission.dimensions,
      materials: submission.materials,
      finishDetails: submission.finish_details,
      timeframe: submission.timeframe,
      rates: submission.rates,
      margin: submission.margin,
      additionalWork: submission.additional_work,
      notes: submission.notes,
      correspondence: submission.correspondence,
      fileCount: files?.length || 0,
      files: files?.map(f => ({
        name: f.file_name,
        type: f.file_type,
        size: f.file_size
      })) || []
    };

    // Generate estimate using OpenAI (placeholder - you can replace with your LLM)
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const startTime = Date.now();

    const systemPrompt = `You are a professional construction cost estimator. Generate a detailed, professional cost estimate in markdown format based on the project data provided. Include:

1. Project Overview
2. Scope of Work
3. Materials and Labor Breakdown
4. Timeline
5. Total Cost Summary
6. Terms and Conditions

Be specific, professional, and provide realistic pricing based on current market rates.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate a cost estimate for this project:\n\n${JSON.stringify(projectData, null, 2)}` }
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    });

    const aiResponse = await response.json();
    
    if (!aiResponse.choices?.[0]?.message?.content) {
      throw new Error('Failed to generate estimate');
    }

    const markdownContent = aiResponse.choices[0].message.content;
    const processingTime = Date.now() - startTime;

    // Save the generated estimate
    const { data: estimate, error: estimateError } = await supabaseClient
      .from('estimates')
      .insert({
        submission_id: submissionId,
        user_id: user.id,
        markdown_content: markdownContent,
        structured_data: projectData,
        processing_time_ms: processingTime,
        llm_model: 'gpt-4o-mini'
      })
      .select()
      .single();

    if (estimateError) {
      throw new Error(`Failed to save estimate: ${estimateError.message}`);
    }

    // Update submission status to completed
    await supabaseClient
      .from('project_submissions')
      .update({ status: 'completed' })
      .eq('id', submissionId)
      .eq('user_id', user.id);

    console.log(`Estimate generated successfully for submission: ${submissionId}`);

    return new Response(JSON.stringify({
      success: true,
      estimate: {
        id: estimate.id,
        markdownContent,
        processingTime
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-estimate function:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});