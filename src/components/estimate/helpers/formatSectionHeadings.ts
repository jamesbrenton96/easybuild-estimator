
/**
 * Formats numbered and recognized section headings.
 */
export function formatSectionHeadings(content: string) {
  // Numbered headings
  let out = content.replace(
    /^([0-9]+)\.\s+([^\n]+)$/gm,
    (_, num, title) => `\n\n## ${num}. ${title}\n`
  );
  // Recognized non-numbered headings, skip Notes & Terms
  out = out.replace(
    /^(Project Overview|Scope of Work|Dimensions|Materials & Cost Breakdown|Material Cost Breakdown|Labor Costs|Labour Costs|Labor Cost Breakdown|Total Estimate|Total Project Cost|Project Timeline|Material Details & Calculations|Client Name|Project Address|Payment Terms|Warranty Information)$/gim,
    (_, cap) => `\n\n### ${cap}\n`
  );
  return out;
}
