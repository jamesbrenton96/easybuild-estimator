
/**
 * Formats the Notes and Terms section.
 * Removes numbering from the beginning of lines in the Notes and Terms section.
 */
export function formatNotesAndTerms(content: string): string {
  // Find the Notes and Terms section
  const notesTermsRegex = /(#\s*(?:NOTES\s*(?:&|AND)\s*TERMS)|(?:NOTES\s*(?:&|AND)\s*TERMS))/i;
  const sections = content.split(notesTermsRegex);
  
  if (sections.length < 2) {
    // No Notes and Terms section found
    return content;
  }
  
  // Process the section after the heading
  const beforeSection = sections[0];
  const notesSection = sections.slice(1).join('');
  
  // Remove numbering (like "1. ", "2. ", etc.) from the beginning of lines
  const processedNotesSection = notesSection.replace(/^\s*\d+[\.\)]\s*/gm, '');
  
  return beforeSection + "# NOTES AND TERMS\n\n" + processedNotesSection;
}
