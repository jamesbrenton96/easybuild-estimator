
interface Section {
  content: string[];
  sectionNumber: number;
  title: string;
}

export function createSection({ content, sectionNumber, title }: Section): string {
  if (!content?.length) return '';
  
  return `# ${sectionNumber}. ${title}

${content.map(item => `- ${item}`).join('\n')}
`;
}
