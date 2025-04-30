/**
 * Formats the Notes and Terms section to remove styling and standardize formatting.
 * Converts the heading to a simple H1 and ensures the text is standard black (no orange/bold/underline).
 */
export function formatNotesAndTerms(content: string): string {
  if (!content) return content;
  
  const lines = content.split('\n');
  let formatted = '';
  let inNotesSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Check for section heading (with any variations and remove "SECTION X:" prefix)
    if (line.match(/(?:SECTION \d+:\s*)?(?:NOTES AND TERMS|NOTES & TERMS|Notes and Terms|Notes & Terms)/i)) {
      inNotesSection = true;
      formatted += '# Notes and Terms\n\n';
      continue;
    }
    
    // Exit notes section if we hit another heading
    if (inNotesSection && line.match(/^#+\s/)) {
      inNotesSection = false;
    }
    
    if (inNotesSection) {
      // Skip if it's the section heading line we already processed
      if (line.match(/(?:SECTION \d+:\s*)?(?:NOTES AND TERMS|NOTES & TERMS|Notes and Terms|Notes & Terms)/i)) {
        continue;
      }
      
      // Remove any styling, make it plain text
      // Remove number prefixes and colons that might trigger styling
      line = line.replace(/^\s*(\d+)[\.\)]\s*([A-Z\s]+):\s*/i, '$1. $2: ');
      line = line.trim();
      
      if (line) {
        formatted += `${line}\n`;
      }
    } else {
      // If we're not in notes section, keep the line as is
      formatted += `${line}\n`;
    }
  }
  
  return formatted.trim();
}
