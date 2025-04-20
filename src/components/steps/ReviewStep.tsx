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
    saveFormData(formData);
    setStep(1);
  };

  const processEstimationResults = () => {
    if (!estimationResults) {
      console.log("No estimation results available");
      return null;
    }
    
    console.log("Processing estimation results:", {
      hasMarkdownContent: !!estimationResults.markdownContent,
      markdownContentLength: estimationResults.markdownContent?.length || 0,
      hasWebhookStatus: !!estimationResults.webhookStatus,
      webhookStatus: estimationResults.webhookStatus || 'unknown',
      hasStructuredEstimate: !!estimationResults.estimate,
      hasWebhookResponseData: !!estimationResults.webhookResponseData,
      hasError: !!estimationResults.error,
      estimateGenerated: !!estimationResults.estimateGenerated
    });
    
    if (estimationResults.estimateGenerated === true && estimationResults.markdownContent) {
      console.log("Using directly generated estimate content");
      return <MarkdownEstimate markdownContent={estimationResults.markdownContent} />;
    }
    
    if (estimationResults.webhookStatus) {
      console.log("Webhook status:", estimationResults.webhookStatus);
    }
    
    if (estimationResults.error) {
      console.log("Error in estimation results:", estimationResults.error);
      return <FallbackEstimate errorDetails={estimationResults.error} />;
    }
    
    const isValidEstimateContent = (content: string) => {
      if (!content) return false;
      
      const estimateIndicators = [
        "Total Project Cost",
        "Materials & Cost Breakdown",
        "Labour Costs",
        "| Materials Subtotal |",
        "| Labour Subtotal |",
        "| Item | Quantity | Unit Price",
        "cost breakdown"
      ];
      
      return estimateIndicators.some(indicator => 
        content.toLowerCase().includes(indicator.toLowerCase())
      );
    };
    
    if (estimationResults.markdownContent && isValidEstimateContent(estimationResults.markdownContent)) {
      console.log("Using valid webhook estimate content");
      return <MarkdownEstimate markdownContent={estimationResults.markdownContent} />;
    }
    
    if (typeof estimationResults.webhookResponseData === 'string' && 
        isValidEstimateContent(estimationResults.webhookResponseData)) {
      console.log("Using webhook response data as estimate");
      return <MarkdownEstimate markdownContent={estimationResults.webhookResponseData} />;
    }
    
    if (estimationResults.estimate) {
      console.log("Using structured estimate");
      return <StructuredEstimate estimate={estimationResults.estimate} />;
    }
    
    if (estimationResults.markdownContent) {
      console.log("Using available markdown content (might be input data)");
      return <MarkdownEstimate markdownContent={estimationResults.markdownContent} />;
    }
    
    if (estimationResults.fallbackContent) {
      console.log("Using fallback content");
      return <MarkdownEstimate markdownContent={estimationResults.fallbackContent} />;
    }
    
    console.log("Using fallback estimate component");
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
