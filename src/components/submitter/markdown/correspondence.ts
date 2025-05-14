
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
  
  // Helper function to get the full correspondence type name
  const getFullCorrespondenceType = (type: string) => {
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
  };

  const fullCorrespondenceType = getFullCorrespondenceType(details.correspondenceType);

  return `# 1. Correspondence

- **Correspondence Type:** ${fullCorrespondenceType}
- **Client Name:** ${details.clientName}
- **Project Address:** ${details.projectAddress}
- **Current Date:** ${currentDate}
- **Project Name:** ${details.projectName}

`;
}
