
/**
 * Formats the Notes & Terms section
 * @param content The markdown content
 * @returns The formatted content
 */
export function formatNotesAndTerms(content: string): string {
  if (!content) return content;
  
  // Extract all Notes & Terms content from the document
  // Create our clean Section that we'll inject
  let notesAndTermsContent = "";
  
  // First check if Notes & Terms is in a table
  if (content.includes("| Notes & Terms") || content.includes("|Notes & Terms")) {
    // Get everything after this table row - we'll extract the content for our section
    const afterNotesRow = content.split(/\|[^\|]*Notes\s*&\s*Terms[^\|]*\|/i)[1];
    if (afterNotesRow) {
      // Look for any text content after the table row, until the next section heading
      const contentMatch = afterNotesRow.match(/(?:.*?)(?=\n#|\n\||$)/s);
      if (contentMatch) {
        notesAndTermsContent = contentMatch[0].trim();
      }
    }
    
    // Remove the original "Notes & Terms" row and any content from the table
    // First, find the table containing Notes & Terms
    const tableRegex = /(\|.*\|(\r?\n\|.*\|)+)/g;
    let tables = [...content.matchAll(tableRegex)];
    
    // Find and remove specifically the table with Notes & Terms
    for (let i = 0; i < tables.length; i++) {
      if (tables[i][0].match(/\|[^\|]*Notes\s*&\s*Terms[^\|]*\|/i)) {
        const tableStart = tables[i].index || 0;
        const tableEnd = tableStart + tables[i][0].length;
        
        // Remove the table itself
        content = content.substring(0, tableStart) + content.substring(tableEnd);
        break;
      }
    }
  } else {
    // If not in a table, look for a Notes & Terms section with a heading
    const notesHeadingMatch = content.match(/(?:^|\n)#+\s*notes\s*(?:&|and)\s*terms.*?(?=\n#+|\n$|$)/is);
    if (notesHeadingMatch) {
      // Found a heading, now get all content that follows until the next heading
      const headingIndex = notesHeadingMatch.index || 0;
      const headingText = notesHeadingMatch[0];
      const contentAfterHeading = content.substring(headingIndex + headingText.length);
      
      // Extract content until the next heading or end of content
      const contentMatch = contentAfterHeading.match(/^(.*?)(?=\n#+\s|\n$|$)/s);
      if (contentMatch) {
        notesAndTermsContent = contentMatch[0].trim();
      }
      
      // Remove the original heading and content
      content = content.substring(0, headingIndex) + 
                content.substring(headingIndex + headingText.length + (contentMatch ? contentMatch[0].length : 0));
    }
  }
  
  // Create a clean "Notes & Terms" H1 heading with the extracted content
  let notesAndTermsSection = "\n\n# Notes & Terms\n\n";
  if (notesAndTermsContent) {
    notesAndTermsSection += notesAndTermsContent;
  }
  
  // Append the new section to the end of the document
  return content + notesAndTermsSection;
}
