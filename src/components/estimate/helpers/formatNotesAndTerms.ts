
/**
 * Formats the Notes & Terms section
 * @param content The markdown content
 * @returns The formatted content
 */
export function formatNotesAndTerms(content: string): string {
  if (!content) return content;
  
  // First check if Notes & Terms is in a table
  const tableRowRegex = /\|\s*Notes\s*&\s*Terms\s*\|.*\|/i;
  const tableMatch = content.match(tableRowRegex);
  
  if (tableMatch) {
    // Remove the Notes & Terms row from the table
    const modifiedContent = content.replace(tableRowRegex, '');
    
    // Add Notes & Terms as H1 heading after the table
    return modifiedContent + "\n\n# Notes & Terms\n\n";
  }
  
  // Regular heading detection (as before)
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
