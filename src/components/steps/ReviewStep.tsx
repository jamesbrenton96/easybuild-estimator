
import React, { useEffect, useRef } from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";

// Import components
import EstimateHeader from "../estimate/EstimateHeader";
import MarkdownEstimate from "../estimate/MarkdownEstimate";
import StructuredEstimate from "../estimate/StructuredEstimate";
import FallbackEstimate from "../estimate/FallbackEstimate";
import EstimateActions from "../estimate/EstimateActions";

export default function ReviewStep() {
  const { estimationResults, setStep } = useEstimator();
  const estimateRef = useRef<HTMLDivElement>(null);
  
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
      margin: [10, 10, 10, 10],
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
    logo.src = "/lovable-uploads/bee065c6-a438-40bf-b1e3-4e1183bbda1d.png";
    logo.style.height = '80px';
    logo.style.margin = '0 auto 20px auto';
    
    const title = document.createElement('h1');
    title.textContent = "Brenton Building Estimate";
    title.style.fontSize = '24px';
    title.style.color = '#e58c33';
    title.style.marginTop = '10px';
    
    header.appendChild(logo);
    header.appendChild(title);
    
    // Insert the header at the top of the clone
    clone.insertBefore(header, clone.firstChild);
    
    html2pdf().from(clone).set(opt).save();
  };

  // Render content based on estimation results
  const renderEstimateContent = () => {
    if (estimationResults.markdownContent) {
      return <MarkdownEstimate markdownContent={estimationResults.markdownContent} />;
    } else if (estimationResults.estimate) {
      return <StructuredEstimate estimate={estimationResults.estimate} />;
    } else {
      return <FallbackEstimate />;
    }
  };

  return (
    <motion.div 
      className="step-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <EstimateHeader />
      
      <div ref={estimateRef} className="max-w-3xl mx-auto pdf-content">
        <style dangerouslySetInnerHTML={{ __html: `
          /* Custom styles for markdown tables */
          .markdown-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            overflow-x: auto;
            display: block;
          }
          
          .markdown-content table th {
            background-color: #f3f4f6;
            font-weight: 600;
            text-align: left;
            padding: 0.75rem;
            border: 1px solid #e5e7eb;
          }
          
          .markdown-content table td {
            padding: 0.75rem;
            border: 1px solid #e5e7eb;
          }
          
          .markdown-content table tr:nth-child(even) {
            background-color: #f9fafb;
          }
          
          /* Improve heading styles */
          .markdown-content h1 {
            color: #e58c33;
            font-size: 1.75rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .markdown-content h2 {
            color: #e58c33;
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 1rem;
          }
          
          .markdown-content h3 {
            color: #4b5563;
            font-size: 1.25rem;
            font-weight: 600;
            margin-top: 1.25rem;
            margin-bottom: 0.75rem;
          }
          
          /* Improve list styles */
          .markdown-content ul, .markdown-content ol {
            padding-left: 1.5rem;
            margin: 1rem 0;
          }
          
          .markdown-content li {
            margin-bottom: 0.5rem;
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
        `}} />
        {renderEstimateContent()}
      </div>
      
      <EstimateActions 
        onDownloadPDF={handleDownloadPDF} 
        onStartNew={() => setStep(1)} 
      />
    </motion.div>
  );
}
