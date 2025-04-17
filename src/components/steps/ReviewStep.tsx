
import React, { useEffect, useRef, useState } from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Save, FileText, Share2 } from "lucide-react";
import { toast } from "sonner";

// Import components
import EstimateHeader from "../estimate/EstimateHeader";
import MarkdownEstimate from "../estimate/MarkdownEstimate";
import StructuredEstimate from "../estimate/StructuredEstimate";
import FallbackEstimate from "../estimate/FallbackEstimate";
import EstimateActions from "../estimate/EstimateActions";
import EditableEstimate from "../estimate/EditableEstimate";
import ShareEstimate from "../estimate/ShareEstimate";

export default function ReviewStep() {
  const { estimationResults, setStep, setEstimationResults } = useEstimator();
  const estimateRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("view");
  const [showShareModal, setShowShareModal] = useState(false);
  
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
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // Try to avoid breaking inside elements
    };
    
    // Create a clone of the element so we can add a logo to just the PDF
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Create a header element with the logo
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.marginBottom = '30px';
    header.style.padding = '20px';
    
    // Use the new logo
    const logo = document.createElement('img');
    logo.src = "/lovable-uploads/54be63ea-83fd-4f4a-8c94-dba12936b674.png";
    logo.style.height = '150px';
    logo.style.margin = '0 auto 20px auto';
    
    header.appendChild(logo);
    
    // Don't add title text since we'll use the Project Name field instead
    
    // Insert the header at the top of the clone
    clone.insertBefore(header, clone.firstChild);
    
    // Set Arial font for the entire document
    clone.style.fontFamily = 'Arial, sans-serif';
    clone.style.fontSize = '12px';
    
    // Apply specific PDF styling to ensure content doesn't get cut off
    const style = document.createElement('style');
    style.textContent = `
      /* PDF-specific styles */
      table { page-break-inside: avoid; }
      h1, h2, h3 { page-break-after: avoid; }
      
      /* Improve table layout for PDF */
      table { 
        width: 100%; 
        font-size: 9px; 
        border-collapse: collapse;
        table-layout: fixed;
      }
      
      td, th { 
        word-break: break-word; 
        padding: 4px; 
        font-size: 9px;
      }
      
      /* Create more compact tables */
      .markdown-content table {
        margin: 1rem 0;
      }
      
      .markdown-content table th,
      .markdown-content table td {
        padding: 4px;
        font-size: 9px;
        line-height: 1.2;
      }
      
      /* Adjust table column widths */
      .markdown-content table th:first-child,
      .markdown-content table td:first-child {
        width: 40%;
      }
      
      .markdown-content table th:nth-child(2),
      .markdown-content table td:nth-child(2) {
        width: 15%;
      }
      
      .markdown-content table th:nth-child(3),
      .markdown-content table td:nth-child(3) {
        width: 15%;
      }
      
      .markdown-content table th:last-child,
      .markdown-content table td:last-child {
        width: 30%;
      }
      
      /* Ensure tables don't get cut off */
      @media print {
        table { page-break-inside: avoid; }
        tr    { page-break-inside: avoid; }
        td    { page-break-inside: avoid; }
        
        /* Reduce margins for print */
        @page {
          margin: 10mm;
        }
        
        /* Force page breaks before major sections */
        h1 { page-break-before: always; }
        
        /* But don't start with a page break */
        h1:first-of-type { page-break-before: avoid; }
        
        /* Reduce spacing between sections */
        p, h2, h3, h4, ul, ol {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
      }
    `;
    clone.appendChild(style);
    
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

  const handleShareClick = () => {
    setShowShareModal(true);
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
          <div ref={estimateRef} className="max-w-3xl mx-auto pdf-content bg-white p-8 rounded-lg shadow-lg">
            <style dangerouslySetInnerHTML={{ __html: `
              /* Base font for PDF content */
              .pdf-content {
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.6;
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
                padding: 0.65rem;
                border: 1px solid #e5e7eb;
                font-family: Arial, sans-serif;
                word-wrap: break-word;
              }
              
              .markdown-content table td {
                padding: 0.65rem;
                border: 1px solid #e5e7eb;
                font-family: Arial, sans-serif;
                word-wrap: break-word;
              }
              
              /* Adjust column widths for better formatting */
              .markdown-content table th:first-child,
              .markdown-content table td:first-child {
                width: 40%;
              }
              
              .markdown-content table th:nth-child(2),
              .markdown-content table td:nth-child(2) {
                width: 15%;
              }
              
              .markdown-content table th:nth-child(3),
              .markdown-content table td:nth-child(3) {
                width: 15%;
              }
              
              .markdown-content table th:last-child,
              .markdown-content table td:last-child {
                width: 30%;
              }
              
              /* Improve heading styles */
              .markdown-content h1 {
                color: #e58c33;
                font-size: 20px;
                font-family: Arial, sans-serif;
                font-weight: 600;
                margin-top: 2rem;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid #e5e7eb;
                page-break-after: avoid;
              }
              
              .markdown-content h2 {
                color: #e58c33;
                font-size: 16px;
                font-family: Arial, sans-serif;
                font-weight: 600;
                margin-top: 1.5rem;
                margin-bottom: 1rem;
                page-break-after: avoid;
              }
              
              .markdown-content h3 {
                color: #4b5563;
                font-size: 14px;
                font-family: Arial, sans-serif;
                font-weight: 600;
                margin-top: 1.25rem;
                margin-bottom: 0.75rem;
                page-break-after: avoid;
              }
              
              .markdown-content h4 {
                color: #4b5563;
                font-size: 13px;
                font-family: Arial, sans-serif;
                font-weight: 600;
                margin-top: 1.25rem;
                margin-bottom: 0.75rem;
                page-break-after: avoid;
              }
              
              /* Improve list and text styling */
              .markdown-content ul, 
              .markdown-content ol,
              .markdown-content p,
              .markdown-content li {
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.6;
                page-break-inside: avoid;
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
                page-break-inside: avoid;
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
        onShare={handleShareClick}
      />

      {showShareModal && (
        <ShareEstimate 
          isOpen={showShareModal} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </motion.div>
  );
}
