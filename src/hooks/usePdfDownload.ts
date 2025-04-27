
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
      .markdown-content h2, h2, .section-title {
        color: #e58c33 !important;
        font-size: 16px !important;
        font-weight: bold !important;
        text-transform: uppercase !important;
        margin-top: 25px !important;
        margin-bottom: 15px !important;
        padding-bottom: 6px !important;
        border-bottom: 1px solid #e58c33 !important;
        letter-spacing: 0.03em !important;
      }
      
      /* Project title */
      .project-title {
        font-size: 24px !important;
        color: #e58c33 !important;
        text-align: center !important;
        margin: 20px 0 30px 0 !important;
        font-weight: bold !important;
      }
      
      /* Table styles */
      table { 
        width: 100% !important;
        max-width: 100% !important;
        margin: 12px auto !important;
        border-collapse: collapse !important;
        background: #fff !important;
        font-size: 9px !important;
        box-shadow: 0 1px 4px rgba(0,0,0,0.05) !important;
        page-break-inside: avoid !important;
      }
      
      td, th { 
        padding: 8px !important;
        font-size: 9px !important;
        line-height: 1.3 !important;
        border: 1px solid #ddd !important;
        text-align: left !important;
      }
      
      th {
        background-color: #f5f5f5 !important;
        color: #333 !important;
        font-weight: bold !important;
      }
      
      tr:nth-child(even) {
        background: #fafafa !important;
      }
      
      /* List formatting */
      ul {
        margin: 8px 0 !important;
        padding-left: 16px !important;
      }
      
      ul li {
        padding: 3px 0 !important;
        font-size: 10px !important;
        margin-bottom: 6px !important;
        line-height: 1.4 !important;
      }
      
      /* Correspondence section */
      .correspondence-item {
        display: flex !important;
        margin-bottom: 6px !important;
      }
      
      .correspondence-label {
        width: 140px !important;
        font-weight: bold !important;
      }
      
      /* Notes and terms */
      .notes-terms p {
        margin: 6px 0 !important;
        font-size: 10px !important;
      }
      
      /* Override font colors */
      .markdown-content p, .markdown-content li {
        color: #333 !important;
      }
      
      .markdown-content strong, .markdown-content b {
        color: #333 !important;
        font-weight: bold !important;
      }
      
      /* Total rows highlight */
      tr:has(td:first-child:contains("TOTAL")),
      tr:has(td:first-child:contains("Total")) {
        font-weight: bold !important;
        background-color: #f5f5f5 !important;
      }
    `;
    
    clone.appendChild(style);
    html2pdf().from(clone).set(opt).save();
  };

  return { handleDownloadPDF };
}
