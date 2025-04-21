
import { useMemo } from "react";

/**
 * useProMarkdownEstimate - Enhanced markdown formatter for construction estimates.
 * Features:
 *  - Formats all main sections with bold, orange, prominent headings (h2/h3)
 *  - Converts simple line items and costs into structured tables
 *  - Enhances existing tables with better styling
 *  - Adds special formatting for totals and summaries
 *  - Cleans up inconsistent whitespace and ensures section separation
 */
export function useProMarkdownEstimate(rawMarkdown: string) {
  return useMemo(() => {
    if (!rawMarkdown) return "";

    let content = rawMarkdown;

    // 1. Fix basic escaped newlines/tabs/quotes
    content = content
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "    ")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");

    // 2. Add estimate header if not present
    if (!content.includes("# Project Cost Estimate") && !content.includes("# Construction Cost Estimate")) {
      content = "# Project Cost Estimate\n\n" + content;
    }

    // 3. Convert numeric section headings to styled headings with orange circles
    content = content.replace(
      /^([0-9]+)\.\s+([^\n]+)$/gm,
      (_, num, title) => `## <span class="section-number">${num}</span>${title}`
    );

    // 4. Convert subsections (using regex to match patterns like "Materials & Cost Breakdown")
    content = content.replace(
      /^(Project Overview|Scope of Work|Dimensions|Materials & Cost Breakdown|Material Cost Breakdown|Labor Costs|Labour Costs|Total Estimate|Project Timeline|Material Details & Calculations|Notes & Terms|Client Name|Project Address|Payment Terms|Warranty Information)$/gim,
      (_, cap) => `### ${cap}`
    );

    // 5. Format tables - enhance existing ones
    // Make table headers bold and colored
    content = content.replace(
      /(^\|\s*([^|\n]+)\s*\|\s*([^|\n]+)\s*\|\s*([^|\n]*)\s*\|)/gm,
      (match, full, col1, col2, col3) => {
        if (full.toLowerCase().includes("item") || 
            full.toLowerCase().includes("description") || 
            full.toLowerCase().includes("task")) {
          return full; // It's already a header, leave it alone
        }
        return full;
      }
    );

    // 6. Convert cost lines WITHOUT table format into tables
    // Match patterns like "Material Cost: $1000" and convert to table rows
    const costLineRegex = /^([^:|\n]+):\s*\$([0-9,]+(?:\.\d{2})?)$/gm;
    if (content.match(costLineRegex)) {
      // First find all cost lines and group them
      const costLines = Array.from(content.matchAll(costLineRegex)).map(match => ({
        label: match[1].trim(),
        amount: match[2].trim()
      }));

      if (costLines.length > 0) {
        // Create a table header
        let tableReplacement = "\n| Description | Amount (NZD) |\n|-------------|------------|\n";
        
        // Add all the cost lines as table rows
        costLines.forEach(line => {
          tableReplacement += `| ${line.label} | $${line.amount} |\n`;
        });
        
        // Replace all the matched cost lines with our new table
        costLines.forEach(line => {
          content = content.replace(
            `${line.label}: $${line.amount}`, 
            "" // Remove the old line
          );
        });
        
        // Add our table where the last cost line was
        content = content.replace(/\n\n+/g, "\n\n"); // Clean up blank lines
        
        // Find a good spot to insert the table - after "Total Estimate" or similar
        const insertPos = content.indexOf("### Total Estimate");
        if (insertPos !== -1) {
          content = content.slice(0, insertPos + 16) + "\n" + tableReplacement + content.slice(insertPos + 16);
        } else {
          // If no good spot, just append to the end
          content += "\n" + tableReplacement;
        }
      }
    }

    // 7. Highlight subtotal, total and summary rows in tables
    content = content.replace(
      /^\|(.*?)(Subtotal|Total Project Cost|Total Estimate|GST|Margin)(.*?)\|(.*)$/gim,
      (match, prefix, key, suffix, values) => {
        // For total rows, add strong emphasis
        if (key.includes("Total Project Cost") || key.includes("Total Estimate")) {
          return `|${prefix}**${key}**${suffix}|**${values.trim()}**|`;
        }
        // For subtotal rows, add moderate emphasis
        return `|${prefix}**${key}**${suffix}|${values}|`;
      }
    );

    // 8. Clean up extra whitespace and ensure consistent spacing
    content = content.replace(/\n{3,}/g, "\n\n");
    
    // 9. Add a special class to the Total Project Cost for extra emphasis
    content = content.replace(
      /\*\*Total Project Cost\*\*.*?\$([0-9,]+(?:\.\d{2})?)/g, 
      (match, amount) => `<div class="total-project-cost">Total Project Cost: $${amount}</div>`
    );

    return content;
  }, [rawMarkdown]);
}
