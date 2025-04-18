
import React, { useEffect, useRef, useState } from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, FileText } from "lucide-react";
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
  const { estimationResults, setStep, setEstimationResults, formData, saveFormData } = useEstimator();
  const estimateRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("view");
  const [showShareModal, setShowShareModal] = useState(false);
  
  // If there are no results, redirect to step 1
  useEffect(() => {
    if (!estimationResults) {
      setStep(1);
    } else {
      console.log("Estimation results received:", estimationResults);
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
        width: 98%; 
        max-width: 98%;
        font-size: 8px; 
        border-collapse: collapse;
        table-layout: fixed;
        margin: 0 auto;
      }
      
      td, th { 
        word-break: break-word; 
        padding: 2px; 
        font-size: 8px;
      }
      
      /* Create more compact tables */
      .markdown-content table {
        margin: 0.5rem auto;
      }
      
      .markdown-content table th,
      .markdown-content table td {
        padding: 2px;
        font-size: 8px;
        line-height: 1.1;
      }
      
      /* Adjust table column widths */
      .markdown-content table th:first-child,
      .markdown-content table td:first-child {
        width: 40%;
      }
      
      .markdown-content table th:nth-child(2),
      .markdown-content table td:nth-child(2) {
        width: 12%;
      }
      
      .markdown-content table th:nth-child(3),
      .markdown-content table td:nth-child(3) {
        width: 12%;
      }
      
      .markdown-content table th:last-child,
      .markdown-content table td:last-child {
        width: 26%;
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
          margin-top: 0.3em;
          margin-bottom: 0.3em;
        }
        
        /* Smaller font sizes for PDF */
        body, p, li, td, th {
          font-size: 8px !important;
          line-height: 1.2 !important;
        }
        
        h1 { font-size: 14px !important; }
        h2 { font-size: 12px !important; }
        h3 { font-size: 10px !important; }
      }
    `;
    clone.appendChild(style);
    
    html2pdf().from(clone).set(opt).save();
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
  
  const handleStartNew = () => {
    // Save current form data before starting a new estimate
    saveFormData(formData);
    setStep(1);
  };

  const processEstimationResults = () => {
    // If there's no estimationResults, return null
    if (!estimationResults) {
      console.log("No estimation results available");
      return null;
    }
    
    // Log detailed information about what we received
    console.log("Processing estimation results:", {
      hasMarkdownContent: !!estimationResults.markdownContent,
      markdownContentLength: estimationResults.markdownContent?.length || 0,
      hasWebhookStatus: !!estimationResults.webhookStatus,
      webhookStatus: estimationResults.webhookStatus || 'unknown',
      hasStructuredEstimate: !!estimationResults.estimate,
      hasWebhookResponseData: !!estimationResults.webhookResponseData,
      hasError: !!estimationResults.error
    });
    
    // Check if we have webhook status information
    if (estimationResults.webhookStatus) {
      console.log("Webhook status:", estimationResults.webhookStatus);
    }
    
    // Check if there's an explicit error in the estimation results
    if (estimationResults.error) {
      console.log("Error in estimation results:", estimationResults.error);
      return <FallbackEstimate errorDetails={estimationResults.error} />;
    }
    
    // If the markdownContent looks like a valid estimate (not just input data),
    // use it directly
    if (estimationResults.markdownContent &&
        (estimationResults.markdownContent.includes("Total Project Cost") ||
         estimationResults.markdownContent.includes("Materials & Cost Breakdown") ||
         estimationResults.markdownContent.includes("Labour Costs"))) {
      console.log("Using valid webhook estimate content");
      return <MarkdownEstimate markdownContent={estimationResults.markdownContent} />;
    }
    
    // If there's a webhook response data that looks like a complete estimate, use that instead
    if (typeof estimationResults.webhookResponseData === 'string' &&
        (estimationResults.webhookResponseData.includes("Total Project Cost") ||
         estimationResults.webhookResponseData.includes("Materials & Cost Breakdown"))) {
      console.log("Using webhook response data as estimate");
      return <MarkdownEstimate markdownContent={estimationResults.webhookResponseData} />;
    }
    
    // If there's a structured estimate object, use StructuredEstimate
    if (estimationResults.estimate) {
      console.log("Using structured estimate");
      return <StructuredEstimate estimate={estimationResults.estimate} />;
    }
    
    // If there's a string in markdownContent and it's not an error message
    // but we're not sure if it's a real estimate, we'll still display it
    if (estimationResults.markdownContent &&
        !estimationResults.markdownContent.includes("Sorry, the estimate couldn't be generated")) {
      console.log("Using available markdown content");
      return <MarkdownEstimate markdownContent={estimationResults.markdownContent} />;
    }
    
    // If the webhook returned some data but not in a format we recognize,
    // check if we have a fallback content or try to convert it to markdown
    if (estimationResults.fallbackContent) {
      console.log("Using fallback content");
      return <MarkdownEstimate markdownContent={estimationResults.fallbackContent} />;
    }
    
    // If we have raw webhook response data but no formatted content
    if (estimationResults.webhookResponseData) {
      console.log("Creating markdown from webhook response data");
      // Try to use the webhook response data directly
      const responseContent = 
        typeof estimationResults.webhookResponseData === 'string' 
          ? estimationResults.webhookResponseData 
          : JSON.stringify(estimationResults.webhookResponseData, null, 2);
          
      return <MarkdownEstimate markdownContent={responseContent} />;
    }
    
    // If we have some kind of data in the results but it's not in a format we handled above
    if (Object.keys(estimationResults).length > 0) {
      console.log("Creating fallback markdown from estimation results");
      // Create a simple markdown representation of the data
      const fallbackMarkdown = "# Construction Cost Estimate\n\n" + 
        Object.entries(estimationResults)
          .filter(([key]) => key !== 'webhookStatus' && key !== 'status')
          .map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              return `## ${key.charAt(0).toUpperCase() + key.slice(1)}\n${JSON.stringify(value, null, 2)}`;
            }
            return `## ${key.charAt(0).toUpperCase() + key.slice(1)}\n${value}`;
          })
          .join('\n\n');
      
      return <MarkdownEstimate markdownContent={fallbackMarkdown} />;
    }
    
    console.log("Using fallback estimate component");
    // If there's no valid format, use FallbackEstimate
    return <FallbackEstimate errorDetails="No estimation data received from the service." />;
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
          <EditableEstimate 
            initialContent={estimationResults.markdownContent || ""}
            onSave={handleSaveEdits} 
          />
        </TabsContent>
      </Tabs>
      
      <EstimateActions 
        onDownloadPDF={handleDownloadPDF} 
        onStartNew={handleStartNew} 
        onShare={handleShareClick}
      />

      {showShareModal && (
        <ShareEstimate 
          isOpen={showShareModal} 
          onClose={() => setShowShareModal(false)} 
          estimateContent={estimationResults.markdownContent}
        />
      )}
    </motion.div>
  );
}
