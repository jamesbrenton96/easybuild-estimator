
interface CorrespondenceDetails {
  correspondenceType: string;
  clientName: string;
  projectAddress: string;
  projectName: string;
  date?: string;
}

export function getFullCorrespondenceType(type: string): string {
  switch (type?.toLowerCase()) {
    case "accurate":
      return "Accurate Estimate";
    case "ballpark":
      return "Ballpark Estimate";
    case "quotation":
      return "Fixed Price Quotation";
    case "quote":
      return "Quotation";
    case "preliminary":
      return "Preliminary Estimate";
    case "proposal":
      return "Proposal";
    default:
      return type || "Estimate";
  }
}

export function createCorrespondenceSection(details: CorrespondenceDetails): string {
  const currentDate = details.date || new Date().toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get the full correspondence type name
  const fullCorrespondenceType = getFullCorrespondenceType(details.correspondenceType);

  // Create bullet points with newlines between them for proper spacing
  return `# 1. Correspondence

- **Correspondence Type:** ${fullCorrespondenceType}

- **Client Name:** ${details.clientName}

- **Project Address:** ${details.projectAddress}

- **Current Date:** ${currentDate}

- **Project Name:** ${details.projectName}

`;
}
