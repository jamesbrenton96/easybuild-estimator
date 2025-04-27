import { createCorrespondenceSection } from './markdown/correspondence';
import { createSection } from './markdown/sections';
import { createMaterialsTable, createLabourTable, createTimelineTable, createTotalSummaryTable } from './markdown/tables';

export function createMarkdownDescription(formData: any): string {
  let markdown = '';
  
  // Line 1: plain text project type (no #, no bold)
  markdown += `${formData.projectType || 'Construction Project'}\n\n`;
  
  // 1. Correspondence section
  markdown += `# 1. Correspondence\n\n`;
  markdown += createCorrespondenceSection({
    correspondenceType: formData.subcategories?.correspondence?.type || 'Quote',
    clientName: formData.subcategories?.correspondence?.clientName || '',
    projectAddress: formData.location || '',
    projectName: formData.projectName || '',
  });
  
  // 2. Project Overview
  markdown += `# 2. Project Overview\n\n${formData.description || ''}\n\n`;
  
  // 3. Scope of Works
  if (Array.isArray(formData.scope)) {
    markdown += `# 3. Scope of Works\n\n`;
    markdown += formData.scope.map(item => `• ${item}`).join('\n') + '\n\n';
  }
  
  // 4. Dimensions
  if (Array.isArray(formData.dimensions)) {
    markdown += `# 4. Dimensions\n\n`;
    markdown += formData.dimensions.map(item => `• ${item}`).join('\n') + '\n\n';
  }
  
  // 5. Materials & Cost Breakdown
  if (Array.isArray(formData.materials)) {
    markdown += `# 5. Materials & Cost Breakdown\n\n`;
    markdown += createMaterialsTable(formData.materials) + '\n\n';
    markdown += `**Materials Sub-total (ex GST):** $${formData.materialsSubtotal || 0}\n`;
    markdown += `**GST 15 %:** $${formData.gst || 0}\n`;
    markdown += `**Materials Total (incl GST):** $${formData.materialsTotal || 0}\n`;
    markdown += `**Builder's Margin 18 %:** $${formData.margin || 0}\n`;
    markdown += `**Materials Grand Total:** **$${formData.materialsGrandTotal || 0}**\n\n`;
  }
  
  // 6. Labour Hours Breakdown
  if (Array.isArray(formData.labour)) {
    markdown += `# 6. Labour Hours Breakdown\n\n`;
    markdown += createLabourTable(formData.labour) + '\n\n';
  }
  
  // 7. Total Summary
  const totals = {
    materialsGrandTotal: formData.materialsGrandTotal || 0,
    labourGrandTotal: formData.labourGrandTotal || 0,
    grandTotal: formData.grandTotal || 0
  };
  markdown += `# 7. Total Summary\n\n`;
  markdown += createTotalSummaryTable(totals) + '\n\n';
  
  // 8. Project Timeline
  if (Array.isArray(formData.timeline)) {
    markdown += `# 8. Project Timeline\n\n`;
    markdown += createTimelineTable(formData.timeline) + '\n\n';
  }
  
  // Process the notes differently - extract keyword and content
  function formatNote(note: string): string {
    const colonIndex = note.indexOf(':');
    if (colonIndex > -1) {
      const keyword = note.substring(0, colonIndex).trim();
      const content = note.substring(colonIndex + 1).trim();
      return `- **${keyword}:** ${content}`;
    }
    return `- ${note}`;
  }

  // 9. Notes & Terms
  if (Array.isArray(formData.notes)) {
    markdown += `# 9. Notes & Terms\n\n`;
    markdown += formData.notes.map(item => formatNote(item)).join('\n') + '\n\n';
  }
  
  return markdown.trim();
}
