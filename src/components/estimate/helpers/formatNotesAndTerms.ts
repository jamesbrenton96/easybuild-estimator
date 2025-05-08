
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
    // First, strip any number prefixes with formatting patterns
    line = line.replace(/^\s*(\d+[\.\)\:]\s*|\#\.\s*|^\d+[\.\-\)\:]|\d+\.|\d+\s|\d+\:)/, '');
    
    // Strip any numbered list formats like "1. ", "2:", "3)", etc.
    line = line.replace(/^\s*\d+[\.\:\)\-]\s*/, '');
    
    // Strip formats like "2. PAYMENT TERMS:" or "3. EXCLUSIONS:"
    line = line.replace(/^\s*\d+\.\s+([A-Z]+\s+[A-Z]+\:)/, '$1');
    line = line.replace(/^\s*\d+\.\s+([A-Z]+\:)/, '$1');
    
    // Remove any pattern starting with only a number at the beginning
    line = line.replace(/^(\d+)[\.\:\)\-]\s*/, '');
    line = line.replace(/^(\d+)\.\s+/, '');
    line = line.replace(/^(\d+)\:\s+/, '');
    line = line.replace(/^(\d+)\s+/, '');
    
    // Remove bullet points if they exist
    line = line.replace(/^\s*[\-\*•]\s*/, '');
    
    // Specifically handle formats like "1. VALIDITY:" or "2. PAYMENT TERMS:"
    line = line.replace(/^\d+\.\s+(([A-Z]+\s*)+\:)/, '$1');
    
    // Extra aggressive number removal for any remaining numbered formats
    line = line.replace(/^[0-9]+[\.:\)\s\-]+/, '');
    line = line.replace(/^\d+[\.:\)\s\-]*\s*/, '');
    line = line.replace(/^[0-9]+\.?\s+/, '');
    
    // Clean up the line
    return line.trim();
  });
  
  // Join the lines with double line breaks to add spacing
  return processedLines.join('\n\n');
}
