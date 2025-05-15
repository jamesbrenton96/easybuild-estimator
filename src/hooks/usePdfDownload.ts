
import html2pdf from "html2pdf.js";
import { useEstimator } from "@/context/EstimatorContext";

export function usePdfDownload() {
  const { showMaterialSources, showMaterialBreakdown } = useEstimator();
  
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
    
    // Clone the element to modify it without affecting the original
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Hide material sources if toggled off
    if (!showMaterialSources) {
      const tables = clone.querySelectorAll('table');
      tables.forEach(table => {
        // Find tables with material sources (5th column)
        const headers = table.querySelectorAll('th');
        const isSourceTable = Array.from(headers).some(header => 
          header.textContent?.toLowerCase().includes('source'));
          
        if (isSourceTable) {
          // Hide the source column (5th column, index 4)
          const rows = table.querySelectorAll('tr');
          rows.forEach(row => {
            const cells = row.querySelectorAll('th, td');
            if (cells.length >= 5) {
              // Cast to HTMLElement before accessing style
              const cell = cells[4] as HTMLElement;
              cell.style.display = 'none';
            }
          });
        }
      });
    }
    
    // Hide material breakdown tables if toggled off, but keep the summary
    if (!showMaterialBreakdown) {
      // Find material breakdown sections and hide them
      const breakdownSections = clone.querySelectorAll('.material-breakdown-section');
      breakdownSections.forEach(section => {
        (section as HTMLElement).style.display = 'none';
      });
      
      // Find sections with material breakdown headings
      const materialHeadings = clone.querySelectorAll('h1, h2, h3, h4');
      materialHeadings.forEach(heading => {
        const headingText = heading.textContent?.toLowerCase() || '';
        if (
          headingText.includes('materials & cost breakdown') ||
          headingText.includes('material breakdown') ||
          headingText.includes('materials breakdown')
        ) {
          // Hide the heading
          (heading as HTMLElement).style.display = 'none';
          
          // Find the next table or section that might be the breakdown
          let currentElement = heading.nextElementSibling;
          
          // Look for the material breakdown table or div until we find a summary/total section
          while (currentElement && 
                 !(currentElement.textContent?.toLowerCase().includes('materials sub-total') || 
                   currentElement.textContent?.toLowerCase().includes('materials subtotal'))) {
            if (currentElement.tagName === 'TABLE' || currentElement.tagName === 'DIV') {
              // Only hide if it doesn't have the material-summary class
              if (!currentElement.classList.contains('material-summary')) {
                (currentElement as HTMLElement).style.display = 'none';
              }
            }
            currentElement = currentElement.nextElementSibling;
          }
        }
      });
      
      // Also look for tables that might be material breakdowns
      const tables = clone.querySelectorAll('table');
      tables.forEach(table => {
        const tableText = table.textContent?.toLowerCase() || '';
        // Check if this looks like a material breakdown table
        if (tableText.includes('material') && 
            !tableText.includes('subtotal') && 
            !tableText.includes('total') &&
            !table.classList.contains('material-summary')) {
          // Check if the table is preceded by a heading about materials
          let prevElement = table.previousElementSibling;
          while (prevElement && prevElement.tagName !== 'H1' && prevElement.tagName !== 'H2' && 
                 prevElement.tagName !== 'H3' && prevElement.tagName !== 'H4') {
            prevElement = prevElement.previousElementSibling;
          }
          
          if (prevElement) {
            const headingText = prevElement.textContent?.toLowerCase() || '';
            if (headingText.includes('material') && !headingText.includes('summary')) {
              (table as HTMLElement).style.display = 'none';
            }
          }
        }
      });
    }
    
    // Create header with logo
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.marginBottom = '5px';
    header.style.padding = '8px';
    
    const logo = document.createElement('img');
    logo.src = "/lovable-uploads/54be63ea-83fd-4f4a-8c94-dba12936b674.png";
    logo.style.height = '100px';
    logo.style.margin = '0 auto 0 auto';
    
    header.appendChild(logo);
    clone.insertBefore(header, clone.firstChild);
    
    // Apply styles to clone
    const htmlClone = clone as HTMLElement;
    htmlClone.style.fontFamily = 'Arial, sans-serif';
    htmlClone.style.fontSize = '10px';
    
    // Add CSS styles to document
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
      
      /* NOTES AND TERMS styling as regular H1/H2 */
      h1:contains("NOTES AND TERMS"), h1:contains("Notes and Terms"),
      h2:contains("NOTES AND TERMS"), h2:contains("Notes and Terms") {
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
      
      /* Notes and Terms numbered items */
      .markdown-content h3:contains("."), h3[id^="validity"], h3[id^="payment"], 
      h3[id^="exclusions"], h3[id^="variations"], h3[id^="access"], 
      h3[id^="weather"], h3[id^="warranty"], h3[id^="gst"],
      h3[id^="site"], h3[id^="material"] {
        color: #e58c33 !important;
        font-size: 11px !important;
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
      
      /* Hide material breakdown sections if toggle is off */
      ${!showMaterialBreakdown ? `
        .material-breakdown-section,
        h2:contains('Materials Breakdown'),
        h2:contains('Materials & Cost Breakdown'),
        h2:contains('Material Breakdown'),
        h3:contains('Materials & Cost Breakdown'),
        h3:contains('Material Breakdown'),
        div:contains('Material Breakdown') div {
          display: none !important;
        }
        
        /* But keep the summary totals visible */
        tr.material-summary,
        .material-summary {
          display: table-row !important;
        }
      ` : ''}
    `;
    
    clone.appendChild(style);
    html2pdf().from(clone).set(opt).save();
  };

  return { handleDownloadPDF };
}
