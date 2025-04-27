
export function createSection(sectionNumber: number, title: string, items: string[]): string {
  if (!items?.length) return '';
  
  return `# ${sectionNumber}. ${title}

${items.map(item => `- ${item}`).join('\n')}

`;
}
