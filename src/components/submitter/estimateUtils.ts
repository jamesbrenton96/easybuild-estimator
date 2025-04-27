
import { createCorrespondenceSection } from './markdown/correspondence';
import { createSection } from './markdown/sections';
import { createMaterialsTable, createLabourTable, createTimelineTable, createTotalSummaryTable } from './markdown/tables';

export function createMarkdownDescription(formData: any): string {
  let markdown = '';
  
  // Line 1: plain text project type (no #, no bold)
  markdown += `${formData.projectType || 'Construction Project'}\n\n`;
  
  // 1. Correspondence section
  markdown += createCorrespondenceSection({
    correspondenceType: formData.subcategories?.correspondence?.type || 'Quote',
    clientName: formData.subcategories?.correspondence?.clientName || '',
    projectAddress: formData.location || '',
    projectName: formData.projectName || '',
  });
  
  // 2. Project Overview
  markdown += `# 2. Project Overview

${formData.description || ''}

`;
  
  // 3. Scope of Works
  if (Array.isArray(formData.scope)) {
    markdown += createSection(3, 'Scope of Works', formData.scope);
  }
  
  // 4. Dimensions
  if (Array.isArray(formData.dimensions)) {
    markdown += createSection(4, 'Dimensions', formData.dimensions);
  }
  
  // 5. Materials & Cost Breakdown
  if (Array.isArray(formData.materials)) {
    markdown += `# 5. Materials & Cost Breakdown

${createMaterialsTable(formData.materials)}**Materials Sub-total (ex GST):** $${formData.materialsSubtotal || 0}
**GST 15 %:** $${formData.gst || 0}
**Materials Total (incl GST):** $${formData.materialsTotal || 0}
**Builder's Margin 18 %:** $${formData.margin || 0}
**Materials Grand Total:** **$${formData.materialsGrandTotal || 0}**

`;
  }
  
  // 6. Labour Hours Breakdown
  if (Array.isArray(formData.labour)) {
    markdown += `# 6. Labour Hours Breakdown

${createLabourTable(formData.labour)}`;
  }
  
  // 7. Total Summary
  const totals = {
    materialsGrandTotal: formData.materialsGrandTotal || 0,
    labourGrandTotal: formData.labourGrandTotal || 0,
    grandTotal: formData.grandTotal || 0
  };
  
  markdown += `# 7. Total Summary

${createTotalSummaryTable(totals)}`;
  
  // 8. Project Timeline
  if (Array.isArray(formData.timeline)) {
    markdown += `# 8. Project Timeline

${createTimelineTable(formData.timeline)}`;
  }
  
  // 9. Notes & Terms
  if (Array.isArray(formData.notes)) {
    markdown += createSection(9, 'Notes & Terms', formData.notes);
  }
  
  return markdown.trim();
}
