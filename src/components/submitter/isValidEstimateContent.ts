
/**
 * Checks whether given content string looks like a valid construction estimate.
 * Used to decide whether to render as Markdown.
 */
export function isValidEstimateContent(content: string) {
  if (!content) return false;

  const estimateIndicators = [
    "Total Project Cost",
    "Materials & Cost Breakdown",
    "Material Cost Breakdown",
    "Labor Costs",
    "Labour Costs",
    "Construction Cost Estimate",
    "| Materials Subtotal |",
    "| Labor Subtotal |",
    "| Labour Subtotal |",
    "| Item | Quantity | Unit Price",
    "Cost Breakdown",
    "Project Timeline",
    "Material Details & Calculations",
    "Notes & Terms",
    "Project Overview",
  ];

  let matchCount = 0;
  estimateIndicators.forEach(indicator => {
    if (content.includes(indicator)) matchCount++;
  });

  const hasTable = content.includes("|") && content.includes("---");

  // Lower the threshold to 1 indicator to be more lenient with formats
  return matchCount >= 1 || hasTable;
}
