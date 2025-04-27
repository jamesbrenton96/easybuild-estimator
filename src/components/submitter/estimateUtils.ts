
import { createCorrespondenceSection } from './markdown/correspondence';
import { createSection } from './markdown/sections';
import { createTable } from './markdown/tables';

export function createMarkdownDescription(formData: any) {
  // Project type as first line
  let markdown = `${formData.projectType || 'Construction Project'}\n\n`;

  // Add correspondence section
  markdown += createCorrespondenceSection({
    correspondenceType: formData.subcategories?.correspondence?.type,
    clientName: formData.subcategories?.correspondence?.clientName,
    projectAddress: formData.location,
    projectName: formData.projectName,
  }) + '\n';

  // Add project overview
  if (formData.description) {
    markdown += `# 2. Project Overview\n\n${formData.description}\n\n`;
  }

  // Add scope of works
  if (formData.scope?.length) {
    markdown += createSection({
      content: formData.scope,
      sectionNumber: 3,
      title: 'Scope of Works'
    }) + '\n';
  }

  // Add dimensions
  if (formData.dimensions?.length) {
    markdown += createSection({
      content: formData.dimensions,
      sectionNumber: 4,
      title: 'Dimensions'
    }) + '\n';
  }

  // Future sections (5-9) can be added here using the utility functions
  
  return markdown.trim();
}
