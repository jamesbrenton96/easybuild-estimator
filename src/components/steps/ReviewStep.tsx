
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
      margin: [10, 15, 10, 15],
      filename: 'brenton-building-estimate.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: ['table', 'img']
      }
    };
    
    const clone = element.cloneNode(true) as HTMLElement;
    
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.marginBottom = '20px';
    header.style.padding = '15px';
    
    const logo = document.createElement('img');
    logo.src = "/lovable-uploads/54be63ea-83fd-4f4a-8c94-dba12936b674.png";
    logo.style.height = '60px';
    logo.style.margin = '0 auto 15px auto';
    
    header.appendChild(logo);
    clone.insertBefore(header, clone.firstChild);
    
    clone.style.fontFamily = 'Arial, sans-serif';
    clone.style.fontSize = '10px';
    
    const style = document.createElement('style');
    style.textContent = `
      @page {
        margin: 15mm;
        size: A4;
      }
      
      body {
        font-size: 10px !important;
        line-height: 1.3 !important;
        font-family: Arial, sans-serif !important;
      }
      
      /* SECTION HEADERS */
      .markdown-content h2, h2 {
        color: #e58c33 !important;
        font-size: 14px !important;
        font-weight: bold !important;
        text-transform: uppercase !important;
        margin-top: 22px !important;
        margin-bottom: 12px !important;
        padding-bottom: 6px !important;
        border-bottom: 1px solid #e58c33 !important;
        letter-spacing: 0.03em !important;
      }
      
      /* Section titles format */
      .section-title {
        color: #e58c33 !important;
        text-transform: uppercase !important;
        font-weight: bold !important;
        border-bottom: 1px solid #e58c33 !important;
        padding-bottom: 5px !important;
        margin-bottom: 12px !important;
        margin-top: 22px !important;
        font-size: 14px !important;
        letter-spacing: 0.03em !important;
      }
      
      /* Table styles */
      table { 
        page-break-inside: avoid !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 8px auto !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
      }
      
      td, th { 
        padding: 5px !important;
        font-size: 9px !important;
        line-height: 1.3 !important;
        border: 1px solid #ddd !important;
        overflow-wrap: break-word !important;
        word-wrap: break-word !important;
      }
      
      th {
        font-size: 9px !important;
        font-weight: bold !important;
        background-color: #f5f5f5 !important;
        color: #333 !important;
        text-align: left !important;
      }
      
      /* List formatting */
      ul {
        margin-left: 0 !important;
        padding-left: 16px !important;
      }
      
      ul li {
        padding: 3px 0 !important;
        font-size: 10px !important;
      }
      
      ul li::marker {
        color: #e58c33 !important;
      }
      
      /* Project title */
      .project-title {
        font-size: 20px !important;
        color: #e58c33 !important;
        text-align: center !important;
        margin: 10px 0 25px 0 !important;
        font-weight: bold !important;
      }
      
      /* Correspondence section */
      .correspondence-item {
        display: flex !important;
        margin-bottom: 5px !important;
      }
      
      .correspondence-label {
        width: 120px !important;
        font-weight: bold !important;
      }
      
      /* Total cost highlighting */
      .total-project-cost {
        font-weight: bold !important;
        background-color: #f5f5f5 !important;
      }
      
      /* Footer */
      .document-footer {
        margin-top: 30px !important;
        font-size: 8px !important;
        color: #666 !important;
        text-align: center !important;
        border-top: none !important;
      }
      
      /* Notes and terms */
      .notes-terms {
        margin-top: 20px !important;
      }
      
      .notes-terms p {
        margin: 6px 0 !important;
        font-size: 10px !important;
      }
      
      /* Override any orange text with standard color */
      .markdown-content p {
        color: #333 !important;
      }
      
      .markdown-content strong, .markdown-content b {
        color: #333 !important;
        font-weight: bold !important;
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
