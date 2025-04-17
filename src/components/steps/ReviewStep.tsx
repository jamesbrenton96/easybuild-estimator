
import React, { useEffect, useRef, useState } from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Save, FileText } from "lucide-react";
import { toast } from "sonner";

// Import components
import EstimateHeader from "../estimate/EstimateHeader";
import MarkdownEstimate from "../estimate/MarkdownEstimate";
import StructuredEstimate from "../estimate/StructuredEstimate";
import FallbackEstimate from "../estimate/FallbackEstimate";
import EstimateActions from "../estimate/EstimateActions";
import EditableEstimate from "../estimate/EditableEstimate";

export default function ReviewStep() {
  const { estimationResults, setStep, setEstimationResults } = useEstimator();
  const estimateRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("view");
  
  // If there are no results, redirect to step 1
  useEffect(() => {
    if (!estimationResults) {
      setStep(1);
    }
  }, [estimationResults, setStep]);
  
  if (!estimationResults) {
    return null;
  }

  const handleDownloadPDF = () => {
    const element = estimateRef.current;
    if (!element) return;
    
    const opt = {
      margin: [15, 15, 15, 15],
      filename: 'brenton-building-estimate.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Create a clone of the element so we can add a logo to just the PDF
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Create a header element with the logo
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.marginBottom = '20px';
    
    const logo = document.createElement('img');
    logo.src = "/lovable-uploads/e9c92678-9834-4536-b060-7f310dff3683.png";
    logo.style.height = '100px';
    logo.style.margin = '0 auto 20px auto';
    
    const title = document.createElement('h1');
    title.textContent = "Brenton Building Estimate";
    title.style.fontSize = '24px';
    title.style.color = '#e58c33';
    title.style.fontFamily = 'Arial, sans-serif';
    title.style.marginTop = '10px';
    
    header.appendChild(logo);
    header.appendChild(title);
    
    // Insert the header at the top of the clone
    clone.insertBefore(header, clone.firstChild);
    
    // Set Arial font for the entire document
    clone.style.fontFamily = 'Arial, sans-serif';
    clone.style.fontSize = '12px';
    
    html2pdf().from(clone).set(opt).save();
  };

  // Determine if we have valid JSON or a string response
  const processEstimationResults = () => {
    // If there's no estimationResults, return null
    if (!estimationResults) return null;
    
    // If there's a string in markdownContent, use MarkdownEstimate
    if (estimationResults.markdownContent) {
      return <MarkdownEstimate markdownContent={estimationResults.markdownContent} />;
    }
    
    // If there's a structured estimate object, use StructuredEstimate
    if (estimationResults.estimate) {
      return <StructuredEstimate estimate={estimationResults.estimate} />;
    }
    
    // If there's no valid format, use FallbackEstimate
    return <FallbackEstimate />;
  };

  const handleSaveEdits = (editedContent: string) => {
    setEstimationResults({
      ...estimationResults,
      markdownContent: editedContent
    });
    
    setActiveTab("view");
    toast.success("Your changes have been saved");
  };

  return (
    <motion.div 
      className="step-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <EstimateHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto mb-4">
        <TabsList className="grid w-full grid-cols-2 bg-white/10">
          <TabsTrigger value="view" className="flex items-center gap-2 text-white data-[state=active]:bg-construction-orange data-[state=active]:text-white">
            <FileText className="h-4 w-4" />
            <span>View Estimate</span>
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex items-center gap-2 text-white data-[state=active]:bg-construction-orange data-[state=active]:text-white">
            <Pencil className="h-4 w-4" />
            <span>Edit Estimate</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="view">
          <div ref={estimateRef} className="max-w-3xl mx-auto pdf-content">
            <style dangerouslySetInnerHTML={{ __html: `
              /* Base font for PDF content */
              .pdf-content {
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.5;
              }
              
              /* Custom styles for markdown tables */
              .markdown-content table {
                width: 100%;
                border-collapse: collapse;
                margin: 1.5rem 0;
                font-family: Arial, sans-serif;
                font-size: 12px;
                table-layout: fixed;
              }
              
              .markdown-content table th {
                background-color: #f3f4f6;
                font-weight: 600;
                text-align: left;
                padding: 0.75rem;
                border: 1px solid #e5e7eb;
                font-family: Arial, sans-serif;
                word-wrap: break-word;
              }
              
              .markdown-content table td {
                padding: 0.75rem;
                border: 1px solid #e5e7eb;
                font-family: Arial, sans-serif;
                word-wrap: break-word;
              }
              
              /* Improve heading styles */
              .markdown-content h1 {
                color: #e58c33;
                font-size: 20px;
                font-family: Arial, sans-serif;
                font-weight: 600;
                margin-bottom: 1.5rem;
                padding-bottom: 0.75rem;
                border-bottom: 1px solid #e5e7eb;
              }
              
              .markdown-content h2 {
                color: #e58c33;
                font-size: 16px;
                font-family: Arial, sans-serif;
                font-weight: 600;
                margin-top: 1.5rem;
                margin-bottom: 1rem;
              }
              
              .markdown-content h3 {
                color: #4b5563;
                font-size: 14px;
                font-family: Arial, sans-serif;
                font-weight: 600;
                margin-top: 1.25rem;
                margin-bottom: 0.75rem;
              }
              
              .markdown-content h4 {
                color: #4b5563;
                font-size: 13px;
                font-family: Arial, sans-serif;
                font-weight: 600;
                margin-top: 1.25rem;
                margin-bottom: 0.75rem;
              }
              
              /* Improve list and text styling */
              .markdown-content ul, 
              .markdown-content ol,
              .markdown-content p,
              .markdown-content li {
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.6;
              }
              
              /* Improve text styling */
              .markdown-content p {
                margin-bottom: 1rem;
                line-height: 1.6;
              }
              
              .markdown-content strong {
                font-weight: 600;
                color: #374151;
              }
              
              /* Add divider styles */
              .markdown-content hr {
                margin: 1.5rem 0;
                border: 0;
                height: 1px;
                background-color: #e5e7eb;
              }
              
              /* Fix pre-formatted text */
              .markdown-content pre {
                background-color: #f9fafb;
                padding: 1rem;
                border-radius: 0.375rem;
                overflow-x: auto;
                margin: 1rem 0;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
              
              .markdown-content code {
                font-family: monospace;
                background-color: #f3f4f6;
                padding: 0.2rem 0.4rem;
                border-radius: 0.25rem;
                font-size: 0.875rem;
              }
            `}} />
            {processEstimationResults()}
          </div>
        </TabsContent>
        
        <TabsContent value="edit">
          {estimationResults.markdownContent ? (
            <EditableEstimate 
              initialContent={estimationResults.markdownContent} 
              onSave={handleSaveEdits} 
            />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-700">This estimate format cannot be edited.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <EstimateActions 
        onDownloadPDF={handleDownloadPDF} 
        onStartNew={() => setStep(1)} 
      />
    </motion.div>
  );
}
