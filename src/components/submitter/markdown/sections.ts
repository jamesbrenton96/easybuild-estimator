
export function createSection(sectionNumber: number, title: string, items: string[]): string {
  if (!items?.length) return '';
  
  // Ensure each item is properly formatted as a bullet point
  const formattedItems = items.map(item => {
    const trimmedItem = item.trim();
    // If item already starts with bullet point markers, don't add another one
    if (trimmedItem.startsWith('-') || trimmedItem.startsWith('*') || trimmedItem.startsWith('•')) {
      return item;
    }
    // Otherwise add bullet point marker
    return `- ${item}`;
  });
  
  // Join with double newlines to ensure spacing between bullet points
  return `# ${sectionNumber}. ${title}

${formattedItems.join('\n\n')}

`;
}
