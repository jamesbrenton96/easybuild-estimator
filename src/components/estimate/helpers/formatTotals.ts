
/**
 * Formats the "Total Estimate" section as a markdown table and standardizes total blocks.
 */
export function formatTotals(content: string) {
  return content.replace(
    /(### Total (Estimate|Project Cost)\n)([^#]*?)(?=\n### |\n## |$)/gi,
    (_, heading, type, body) => {
      // Already table
      if (body.includes("| Description | Amount |") || body.includes("total-project-cost-block")) {
        return heading + body;
      }
      const totalMatch = body.match(/Total Project Cost:?\s*\$([0-9,]+\.\d{2}|\d+)/i);
      const totalAmount = totalMatch ? totalMatch[1] : "";
      let tableRows = [];
      const lines = body
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

      if (lines.length > 0) {
        tableRows.push("| Description | Amount (NZD) |");
        tableRows.push("|-------------|-------------|");

        lines.forEach(line => {
          const match = line.match(/(.*?)(?:\:|\s+)?\$?([0-9,]+\.\d{2}|\d+)$/);
          if (match) {
            const description = match[1].trim();
            const amount = match[2].trim();
            if (!description.toLowerCase().includes("total project cost")) {
              tableRows.push(`| ${description} | $${amount} |`);
            }
          } else if (line.includes("\t")) {
            const parts = line.split("\t").filter(Boolean);
            if (parts.length >= 2) {
              const description = parts[0].trim();
              const lastPart = parts[parts.length - 1].trim();
              const amountMatch = lastPart.match(/\$?([0-9,]+\.\d{2}|\d+)/);
              if (amountMatch) {
                tableRows.push(`| ${description} | $${amountMatch[1]} |`);
              }
            }
          }
        });

        if (totalAmount) {
          tableRows.push(`| **TOTAL PROJECT COST** | **$${totalAmount}** |`);
        }
        if (tableRows.length <= 2 && totalAmount) {
          tableRows.push(`| **TOTAL PROJECT COST** | **$${totalAmount}** |`);
        }
      }
      if (tableRows.length > 2) {
        return heading + "\n" + tableRows.join("\n") + "\n\n";
      }
      if (totalAmount) {
        return heading + "\n<span class=\"total-project-cost-block\">Total Project Cost: $" + totalAmount + "</span>\n\n";
      }
      return heading + body;
    }
  );
}
