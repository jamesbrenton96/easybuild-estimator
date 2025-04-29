
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
  
  // Replace the heading with a properly formatted one
  const heading = "### Notes & Terms\n\n";
  
  // Extract the section content and format as normal paragraphs (not headings)
  const remainingContent = content.slice(sectionHeadingEndIndex);
  
  // Ensure any # at the start of lines in the Notes & Terms section are removed
  // unless they are part of another section heading
  const formattedContent = remainingContent.replace(/^#\s+(?!#)/gm, '');
  
  return (
    content.slice(0, sectionStartIndex) +
    heading +
    formattedContent
  );
}
