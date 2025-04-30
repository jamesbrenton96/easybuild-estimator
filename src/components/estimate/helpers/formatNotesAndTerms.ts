
/**
 * Formats the Notes & Terms section
 * @param content The markdown content
 * @returns The formatted content
 */
export function formatNotesAndTerms(content: string): string {
  if (!content) return content;
  
  // Check if Notes & Terms is in a table row anywhere in the document
  const tableRowRegex = /\|[^\|]*Notes\s*&\s*Terms[^\|]*\|/i;
  const tableMatch = content.match(tableRowRegex);
  
  if (tableMatch) {
    console.log("Found Notes & Terms in a table");
    
    // Find the table that contains Notes & Terms
    const tableRegex = /(\|.*\|(\r?\n\|.*\|)+)/g;
    let tables = [...content.matchAll(tableRegex)];
    
    // Find the specific table with Notes & Terms
    let targetTable = null;
    let targetTableIndex = -1;
    
    for (let i = 0; i < tables.length; i++) {
      if (tables[i][0].match(tableRowRegex)) {
        targetTable = tables[i][0];
        targetTableIndex = tables[i].index;
        break;
      }
    }
    
    if (targetTable && targetTableIndex !== -1) {
      // Get content before and after the table
      const contentBefore = content.substring(0, targetTableIndex);
      const contentAfter = content.substring(targetTableIndex + targetTable.length);
      
      // Remove the Notes & Terms row from the table
      const newTable = targetTable.split('\n')
        .filter(row => !row.match(tableRowRegex))
        .join('\n');
      
      // Rebuild the content with the modified table and add Notes & Terms as H1
      return contentBefore + 
             (newTable.trim().length > 0 ? newTable : '') + 
             "\n\n# Notes & Terms\n\n" + 
             contentAfter;
    }
  }
  
  // Regular heading detection (fallback)
  const notesAndTermsRegex = /(?:^|\n)(#+\s*notes\s*(?:&|and)\s*terms.*?)(?:\n#+\s|\n$|$)/is;
  const match = content.match(notesAndTermsRegex);
  
  if (!match) return content;
  
  const sectionStartIndex = match.index as number;
  const sectionHeadingEndIndex = sectionStartIndex + match[1].length;
  
  // Replace the heading with a properly formatted H1
  const heading = "# Notes & Terms\n\n";
  
  // Extract the section content
  const remainingContent = content.slice(sectionHeadingEndIndex);
  
  // Convert any numbered headings (1. Text) to regular text without # markers
  const formattedContent = remainingContent.replace(/^#+\s*(\d+\.\s+.*?)$/gm, '$1');
  
  return (
    content.slice(0, sectionStartIndex) +
    heading +
    formattedContent
  );
}
