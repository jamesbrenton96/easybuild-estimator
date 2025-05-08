
/**
 * Formats the Notes and Terms section with extra spacing between lines and no numbers.
 */
export function formatNotesAndTerms(content: string): string {
  // Skip processing if content is empty
  if (!content) return content;
  
  // Split the content by lines
  let lines = content.split('\n');
  
  // Process each line
  const processedLines = lines.map(line => {
    // Remove any numbered list formatting (e.g., "1. ", "1) ", "#. ", etc.)
    line = line.replace(/^\s*(\d+[\.\)\:]\s*|\#\.\s*|^\d+[\.\-\)\:]|\d+\.|\d+\s|\d+\:)/, '');
    
    // Remove any line-starting patterns like "2." or "3:" or "4)" without a space
    line = line.replace(/^\s*\d+[\.\:\)\-]/, '');
    
    // Remove more formats like "2. PAYMENT TERMS:" where the number is at the start
    line = line.replace(/^\s*\d+\.\s+([A-Z]+\s+[A-Z]+\:)/, '$1');
    
    // Remove patterns where the number is the very first character
    line = line.replace(/^(\d+)[\.\:\)\-]\s*/, '');
    
    // Remove any text that starts with just a number 
    line = line.replace(/^(\d+)\.\s+/, '');
    line = line.replace(/^(\d+)\:\s+/, '');
    line = line.replace(/^(\d+)\s+/, '');
    
    // Remove any bullet points if they exist
    line = line.replace(/^\s*[\-\*•]\s*/, '');
    
    // Clean up the line
    return line.trim();
  });
  
  // Join the lines with double line breaks to add spacing
  return processedLines.join('\n\n');
}
