
/**
 * Formats the Notes & Terms section
 * @param content The markdown content
 * @returns The formatted content
 */
export function formatNotesAndTerms(content: string): string {
  if (!content) return content;
  
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
  // This regex matches lines that start with a number, period, and text
  const formattedContent = remainingContent.replace(/^#+\s*(\d+\.\s+.*?)$/gm, '$1');
  
  return (
    content.slice(0, sectionStartIndex) +
    heading +
    formattedContent
  );
}
