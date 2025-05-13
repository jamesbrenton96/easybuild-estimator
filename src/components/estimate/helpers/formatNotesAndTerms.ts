
/**
 * Formats the Notes and Terms section.
 */
export function formatNotesAndTerms(content: string): string {
  // Apply special formatting to the Notes and Terms section
  let formattedContent = content;
  
  // Find the Notes and Terms section
  const notesTermsMatch = content.match(/(?:^|\n)(?:#+\s*)(NOTES AND TERMS|Notes and Terms)(?:\s*\n+)(.+?)(?=\n(?:#+\s*|$))/is);
  
  if (notesTermsMatch) {
    // Get the heading and content
    const [fullMatch, heading, termsContent] = notesTermsMatch;
    
    // Format the numbered items within Notes and Terms
    const formattedTermsContent = termsContent.replace(
      /(\d+)\.\s*([A-Z\s]+):\s*(.+?)(?=\n\d+\.|$)/gs,
      (_, num, title, desc) => {
        return `**${num}. ${title}:** ${desc.trim()}\n\n`;
      }
    );
    
    // Replace the original notes and terms with the formatted version
    formattedContent = content.replace(fullMatch, `\n\n# ${heading}\n\n${formattedTermsContent}`);
  }
  
  return formattedContent;
}
