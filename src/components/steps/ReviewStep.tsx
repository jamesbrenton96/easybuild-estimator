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
      margin: [15, 15, 15, 15],
      filename: 'brenton-building-estimate.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    const clone = element.cloneNode(true) as HTMLElement;
    
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.marginBottom = '30px';
    header.style.padding = '20px';
    
    const logo = document.createElement('img');
    logo.src = "/lovable-uploads/54be63ea-83fd-4f4a-8c94-dba12936b674.png";
    logo.style.height = '150px';
    logo.style.margin = '0 auto 20px auto';
    
    header.appendChild(logo);
    
    clone.insertBefore(header, clone.firstChild);
    
    clone.style.fontFamily = 'Arial, sans-serif';
    clone.style.fontSize = '12px';
    
    const style = document.createElement('style');
    style.textContent = `
      table { page-break-inside: avoid; }
      h1, h2, h3 { page-break-after: avoid; }
      
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
      
      .markdown-content table {
        margin: 0.5rem auto;
      }
      
      .markdown-content table th,
      .markdown-content table td {
        padding: 2px;
        font-size: 8px;
        line-height: 1.1;
      }
      
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
      
      @media print {
        table { page-break-inside: avoid; }
        tr    { page-break-inside: avoid; }
        td    { page-break-inside: avoid; }
        
        @page {
          margin: 10mm;
        }
        
        h1 { page-break-before: always; }
        h1:first-of-type { page-break-before: avoid; }
        
        p, h2, h3, h4, ul, ol {
          margin-top: 0.3em;
          margin-bottom: 0.3em;
        }
        
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
