
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
      margin: [10, 10, 10, 10],
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
    logo.style.height = '100px';
    logo.style.margin = '0 auto 15px auto';
    
    header.appendChild(logo);
    clone.insertBefore(header, clone.firstChild);
    
    clone.style.fontFamily = 'Arial, sans-serif';
    clone.style.fontSize = '10px';
    
    const style = document.createElement('style');
    style.textContent = `
      @page {
        margin: 10mm;
        size: A4;
      }
      
      body {
        font-size: 10px !important;
        line-height: 1.3 !important;
      }
      
      table { 
        page-break-inside: avoid !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 8px auto !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
      }
      
      td, th { 
        padding: 4px !important;
        font-size: 9px !important;
        line-height: 1.2 !important;
        overflow-wrap: break-word !important;
        word-wrap: break-word !important;
      }
      
      .markdown-content table {
        margin: 0.5rem auto !important;
      }
      
      .markdown-content table th,
      .markdown-content table td {
        padding: 4px !important;
        font-size: 9px !important;
        line-height: 1.2 !important;
      }

      /* Header row adjustments */
      .markdown-content table th {
        font-size: 8px !important;
        font-weight: normal !important;
        text-transform: uppercase !important;
        padding: 6px !important;
        background-color: #e58c33 !important;
        color: white !important;
      }

      /* Adjust width of header columns */
      .markdown-content table th:first-child {
        width: 50% !important;
      }
      
      .markdown-content table th:nth-child(2),
      .markdown-content table th:nth-child(3),
      .markdown-content table th:nth-child(4) {
        width: 15% !important;
      }
      
      /* Tighter spacing for text content */
      p, h2, h3, h4, ul, ol {
        margin-top: 0.4em !important;
        margin-bottom: 0.4em !important;
        line-height: 1.3 !important;
      }
      
      /* Adjusted heading sizes */
      h1 { font-size: 16px !important; margin-bottom: 8px !important; }
      h2 { font-size: 14px !important; margin-top: 12px !important; }
      h3 { font-size: 12px !important; }
      h4 { font-size: 11px !important; }
      
      /* Ensure proper table breaks */
      tr { page-break-inside: avoid !important; }
      
      /* List item spacing */
      li {
        margin-bottom: 0.3em !important;
        line-height: 1.3 !important;
        font-size: 10px !important;
      }
      
      /* Total project cost block adjustments */
      .total-project-cost-block {
        font-size: 14px !important;
        padding: 10px 15px !important;
        margin: 15px 0 12px 0 !important;
      }
      
      /* Table spacing improvements */
      .markdown-content table tr td:last-child {
        text-align: right !important;
      }
      
      .markdown-content table tr:last-child td {
        border-top: 2px solid #e58c33 !important;
      }
      
      /* Ensure notes and terms are properly formatted */
      .markdown-content p:has(.section-number) {
        padding-left: 0.3rem !important;
        margin-bottom: 0.4rem !important;
      }
      
      .section-number {
        width: 22px !important;
        height: 22px !important;
        margin-right: 0.4rem !important;
        font-size: 0.85rem !important;
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
