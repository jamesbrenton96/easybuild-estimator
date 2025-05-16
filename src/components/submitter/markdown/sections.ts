
export function createSection(sectionNumber: number, title: string, items: string[]): string {
  if (!items?.length) return '';
  
  // Ensure each item is properly formatted as a bullet point and on its own line
  const formattedItems = items.map(item => {
    // Clean up the item text and ensure it's on its own line
    const cleanedItem = item.trim();
    
    // If item already starts with bullet point markers, don't add another one
    if (cleanedItem.startsWith('-') || cleanedItem.startsWith('*')) {
      return cleanedItem;
    }
    // Otherwise add bullet point marker
    return `- ${cleanedItem}`;
  });
  
  // Join with TWO newlines to ensure proper spacing between bullet points
  return `# ${sectionNumber}. ${title}

${formattedItems.join('\n\n')}

`;
}
