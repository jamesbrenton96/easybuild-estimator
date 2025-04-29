
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
        font-size: 10px;
        line-height: 1.3;
        font-family: Arial, sans-serif;
      }
      
      /* SECTION HEADERS */
      .section-title {
        color: #e58c33;
        font-weight: bold;
        border-bottom: 1px solid #e58c33;
        padding-bottom: 5px;
        margin-bottom: 12px;
        margin-top: 22px;
        font-size: 14px;
      }
      
      /* Notes and Terms heading */
      h1, h2 {
        color: #e58c33;
        font-weight: bold;
        border-bottom: 1px solid #e58c33;
        padding-bottom: 5px;
        margin-bottom: 12px;
        margin-top: 20px;
        font-size: 14px;
      }
      
      /* Table styles */
      table { 
        page-break-inside: avoid;
        width: 100%;
        max-width: 100%;
        margin: 8px auto;
        border-collapse: collapse;
        table-layout: fixed;
      }
      
      td, th { 
        padding: 5px;
        font-size: 9px;
        line-height: 1.3;
        border: 1px solid #ddd;
        overflow-wrap: break-word;
        word-wrap: break-word;
      }
      
      th {
        font-size: 9px;
        font-weight: bold;
        background-color: #f5f5f5;
        color: #333;
        text-align: left;
      }
      
      /* Project title */
      .project-title {
        font-size: 20px;
        color: #e58c33;
        text-align: center;
        margin: 10px 0 25px 0;
        font-weight: bold;
      }
      
      /* Footer */
      .document-footer {
        margin-top: 30px;
        font-size: 8px;
        color: #666;
        text-align: center;
        border-top: none;
      }
    `;
    
    clone.appendChild(style);
    html2pdf().from(clone).set(opt).save();
  };

  return { handleDownloadPDF };
}
