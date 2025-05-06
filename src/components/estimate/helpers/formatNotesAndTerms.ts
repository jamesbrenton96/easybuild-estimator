/**
 * Formats the Notes and Terms section to match heading style and standardize bullet points.
 * Converts numbered items into bullet points and ensures all text is black (not orange).
 */
export function formatNotesAndTerms(content: string): string {
  if (!content) return content;
  
  const lines = content.split('\n');
  let formatted = '';
  let inNotesSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Check for section heading
    if (line.toLowerCase().includes('notes and terms') || line.toLowerCase().includes('notes & terms')) {
      inNotesSection = true;
      formatted += '# SECTION 9: NOTES AND TERMS\n\n';
      continue;
    }
    
    // Exit notes section if we hit another heading
    if (inNotesSection && line.startsWith('#')) {
      inNotesSection = false;
    }
    
    if (inNotesSection && line.trim()) {
      // Skip if it's the section heading line
      if (line.toLowerCase().includes('notes and terms') || line.toLowerCase().includes('notes & terms')) {
        continue;
      }
      
      line = line.trim();
      
      // Preserve indentation for sub-bullets
      const indentation = line.match(/^(\s+)/)?.[1] || '';
      line = line.trim();
      
      // Format numbered items without turning them into headings and without styling
      const numberedItemMatch = line.match(/^(\d+)[\.\)]\s*(.*)/);
      if (numberedItemMatch) {
        const number = numberedItemMatch[1];
        const text = numberedItemMatch[2];
        
        // Check for keyword: description pattern but don't bold the keyword
        const colonIndex = text.indexOf(':');
        if (colonIndex > 0) {
          const keyword = text.substring(0, colonIndex).trim();
          const rest = text.substring(colonIndex);
          line = `${number}. ${keyword}${rest}`;
        } else {
          line = `${number}. ${text}`;  
        }
      }
      // Skip if it's already a bullet point
      else if (!line.startsWith('-') && !line.startsWith('•')) {
        // Don't add special formatting to keyword: description pattern
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const keyword = line.substring(0, colonIndex).trim();
          const rest = line.substring(colonIndex);
          line = `- ${keyword}${rest}`;
        } else {
          line = `- ${line}`;
        }
      }
      
      formatted += `${indentation}${line}\n`;
    } else if (!inNotesSection) {
      // If we're not in notes section, keep the line as is
      formatted += `${line}\n`;
    }
  }
  
  return formatted.trim();
}
