
import React, { useEffect, useRef } from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";
import { ReviewHeader } from "./ReviewHeader";
import { ReviewTabs } from "./ReviewTabs";
import { ReviewActions } from "./ReviewActions";

export default function ReviewStep() {
  const { estimationResults, setStep, setEstimationResults, formData, saveFormData } = useEstimator();

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
    const element = document.querySelector('.pdf-content');
    if (!element) return;
    
    const opt = {
      margin: [10, 10, 10, 10], // Reduced margins (top, right, bottom, left)
      filename: 'brenton-building-estimate.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    const clone = element.cloneNode(true) as HTMLElement;
    
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.marginBottom = '15px'; // Reduced margin
    header.style.padding = '10px'; // Reduced padding
    
    const logo = document.createElement('img');
    logo.src = "/lovable-uploads/54be63ea-83fd-4f4a-8c94-dba12936b674.png";
    logo.style.height = '100px'; // Smaller logo
    logo.style.margin = '0 auto 10px auto'; // Reduced margin
    
    header.appendChild(logo);
    
    clone.insertBefore(header, clone.firstChild);
    
    clone.style.fontFamily = 'Arial, sans-serif';
    clone.style.fontSize = '10px'; // Smaller base font size
    
    const style = document.createElement('style');
    style.textContent = `
      /* Prevent page breaks inside tables and after headings */
      table { page-break-inside: avoid; }
      h1, h2, h3 { page-break-after: avoid; }
      
      /* Better table styling for PDF export */
      table { 
        width: 100%;
        max-width: 100%;
        font-size: 8px; 
        border-collapse: collapse;
        table-layout: fixed;
        margin: 6px auto;
      }
      
      td, th { 
        word-break: break-word; 
        padding: 2px 4px; 
        font-size: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      /* Fix column widths for better layout */
      .markdown-content table th:first-child,
      .markdown-content table td:first-child {
        width: 50%;
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
        width: 20%;
      }
      
      /* Reduced spacing for PDF */
      .markdown-content p {
        margin: 3px 0;
        font-size: 9px;
        line-height: 1.3;
      }
      
      .markdown-content ul, .markdown-content ol {
        margin: 3px 0;
        padding-left: 15px;
      }
      
      .markdown-content li {
        margin-bottom: 2px;
        font-size: 9px;
        line-height: 1.3;
      }
      
      /* Heading sizes */
      .markdown-content h1 { 
        font-size: 14px !important; 
        margin: 8px 0 4px 0 !important;
      }
      
      .markdown-content h2 { 
        font-size: 12px !important; 
        margin: 6px 0 3px 0 !important;
      }
      
      .markdown-content h3 { 
        font-size: 10px !important; 
        margin: 5px 0 2px 0 !important;
      }
      
      /* Small section number circles */
      .markdown-content .section-number {
        width: 18px !important;
        height: 18px !important;
        font-size: 8px !important;
      }
      
      @media print {
        table { page-break-inside: avoid; }
        tr    { page-break-inside: avoid; }
        td    { page-break-inside: avoid; }
        
        @page {
          margin: 8mm;
        }
        
        body, p, li, td, th {
          font-size: 8px !important;
          line-height: 1.2 !important;
        }
        
        h1 { font-size: 14px !important; }
        h2 { font-size: 12px !important; }
        h3 { font-size: 10px !important; }
        
        /* Tighten spacing */
        p, h2, h3, h4, ul, ol {
          margin-top: 0.2em !important;
          margin-bottom: 0.2em !important;
        }
      }
    `;
    clone.appendChild(style);
    
    html2pdf().from(clone).set(opt).save();
  };

  const handleStartNew = () => {
    saveFormData(formData);
    setStep(1);
  };

  return (
    <motion.div
      className="step-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <ReviewHeader />

      <ReviewTabs
        estimationResults={estimationResults}
        setEstimationResults={setEstimationResults}
      />

      <ReviewActions
        estimationResults={estimationResults}
        onDownloadPDF={handleDownloadPDF}
        onStartNew={handleStartNew}
      />
    </motion.div>
  );
}
