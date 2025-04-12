
import React, { useEffect, useRef } from "react";
import { useEstimator } from "@/context/EstimatorContext";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Clock, FileText, Info, Download, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import html2pdf from "html2pdf.js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        {renderEstimateContent()}
      </div>
      
      <EstimateActions 
        onDownloadPDF={handleDownloadPDF} 
        onStartNew={() => setStep(1)} 
      />
    </motion.div>
  );
}
