/**
 * Formats the Notes and Terms section to bold keywords before colons and create proper bullet points.
 * Removes numbering and "SECTION" wording.
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
      formatted += '# Notes and Terms\n\n';
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
      
      // Remove any numbering completely
      const numberedItemMatch = line.match(/^(\d+)[\.\)\:\s]+\s*(.*)/);
      if (numberedItemMatch) {
        line = numberedItemMatch[2];
      }
      
      // Check for keyword: description pattern and bold the keyword
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const keyword = line.substring(0, colonIndex).trim();
        const rest = line.substring(colonIndex);
        line = `**${keyword}**${rest}`;
      }
      
      // Only add bullets if it's not already a bullet point
      if (!line.startsWith('-') && !line.startsWith('•')) {
        formatted += `${indentation}- ${line}\n`;
      } else {
        formatted += `${indentation}${line}\n`;
      }
    } else if (!inNotesSection) {
      // If we're not in notes section, keep the line as is
      formatted += `${line}\n`;
    }
  }
  
  return formatted.trim();
}
