/**
 * Formats the Notes and Terms section to match heading style and standardize bullet points
 */
export function formatNotesAndTerms(content: string): string {
  // Early return if no content
  if (!content) return content;
  
  // Split content into lines for processing
  const lines = content.split('\n');
  let formatted = '';
  let inNotesSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for section heading
    if (line.toLowerCase().includes('notes and terms') || line.toLowerCase().includes('notes & terms')) {
      inNotesSection = true;
      formatted += '# SECTION 9: NOTES AND TERMS\n\n';
      continue;
    }
    
    // If we're in notes section and find a new heading, exit
    if (inNotesSection && line.startsWith('#')) {
      inNotesSection = false;
    }
    
    // Process lines within notes section
    if (inNotesSection && line) {
      // Skip the line if it's the section heading
      if (line.toLowerCase().includes('notes and terms') || line.toLowerCase().includes('notes & terms')) {
        continue;
      }
      
      // Remove any numbers at start (like "1.", "2.", etc)
      let cleanLine = line.replace(/^\d+[\.\)]\s*/, '');
      
      // If line doesn't start with a bullet point or dash, add one
      if (!cleanLine.startsWith('-') && !cleanLine.startsWith('•')) {
        cleanLine = `- ${cleanLine}`;
      }
      
      formatted += `${cleanLine}\n`;
    } else if (!inNotesSection) {
      // If we're not in notes section, keep the line as is
      formatted += `${line}\n`;
    }
  }
  
  return formatted.trim();
}
