export function createSection(sectionNumber: number, title: string, items: string[]): string {
  if (!items?.length) return '';
  
  // Ensure each item is properly formatted as a bullet point
  const formattedItems = items.map(item => {
    // If item already starts with bullet point markers, don't add another one
    if (item.trim().startsWith('-') || item.trim().startsWith('*')) {
      return item;
    }
    // Otherwise add bullet point marker
    return `- ${item}`;
  });
  
  return `# ${sectionNumber}. ${title}

${formattedItems.join('\n')}

`;
}
