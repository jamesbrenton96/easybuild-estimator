
interface CorrespondenceDetails {
  correspondenceType: string;
  clientName: string;
  projectAddress: string;
  projectName: string;
  date?: string;
}

export function createCorrespondenceSection(details: CorrespondenceDetails): string {
  const currentDate = details.date || new Date().toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `# 1. Correspondence

- **Correspondence Type:** ${details.correspondenceType}
- **Client Name:** ${details.clientName}
- **Project Address:** ${details.projectAddress}
- **Current Date:** ${currentDate}
- **Project Name:** ${details.projectName}
`;
}
