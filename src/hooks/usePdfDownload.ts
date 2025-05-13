
import html2pdf from "html2pdf.js";

export function usePdfDownload() {
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
    header.style.marginBottom = '10px'; // Reduced from 20px
    header.style.padding = '10px'; // Reduced from 15px
    
    const logo = document.createElement('img');
    logo.src = "/lovable-uploads/54be63ea-83fd-4f4a-8c94-dba12936b674.png";
    logo.style.height = '100px';
    logo.style.margin = '0 auto 0 auto'; // Removed bottom margin completely
    
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
      
      /* NOTES AND TERMS styling - different from H1/H2 */
      .markdown-content h1:contains("NOTES AND TERMS"), h1:contains("Notes and Terms") {
        color: #333333 !important;
        font-size: 16px !important;
        font-weight: bold !important;
        text-transform: uppercase !important;
        margin-top: 30px !important;
        margin-bottom: 15px !important;
        padding: 8px 0 !important;
        border-top: 2px solid #e58c33 !important;
        border-bottom: 2px solid #e58c33 !important;
        letter-spacing: 0.05em !important;
        text-align: center !important;
        background-color: #f9f9f9 !important;
      }
      
      /* Notes and Terms numbered items */
      .markdown-content h3:contains("."), h3[id^="validity"], h3[id^="payment"], 
      h3[id^="exclusions"], h3[id^="variations"], h3[id^="access"], 
      h3[id^="weather"], h3[id^="warranty"], h3[id^="gst"],
      h3[id^="site"], h3[id^="material"] {
        color: #e58c33 !important;
        font-size: 12px !important;
        font-weight: bold !important;
        text-transform: uppercase !important;
        margin-top: 18px !important;
        margin-bottom: 8px !important;
        padding-bottom: 4px !important;
        border-bottom: 1px dotted #e58c33 !important;
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
        margin-bottom: 15px !important;
      }
      
      ul li {
        padding: 3px 0 !important;
        font-size: 10px !important;
        color: #222 !important;
      }
      
      ol li {
        padding: 3px 0 !important;
        font-size: 10px !important;
        color: #222 !important;
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

  return { handleDownloadPDF };
}
