import { useMemo } from "react";

/**
 * useProMarkdownEstimate - Enhanced markdown formatter for construction estimates.
 *
 * Features:
 *  - Prominent headings and numbered orange markers for each section.
 *  - Always formats materials, labor costs, and totals as tables.
 *  - Bullet points force-applied for Scope of Work, Material Details & Calculations, and Notes/Terms.
 *  - Distinct separation and styling for the total, plus an orange horizontal divider.
 *  - Cleans up whitespace and ensures section separation.
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
    if (!content.match(/^# (Project Cost Estimate|Construction Cost Estimate)/m)) {
      content = "# Project Cost Estimate\n\n" + content;
    }

    // 3. Major sections: Numbered headings with orange "circle"
    content = content.replace(
      /^([0-9]+)\.\s+([^\n]+)$/gm,
      (_, num, title) => `\n\n## <span class="section-number">${num}</span>${title}\n`
    );

    // 4. Recognized section (bolded) headers (for non-numbered section titles)
    content = content.replace(
      /^(Project Overview|Scope of Work|Dimensions|Materials & Cost Breakdown|Material Cost Breakdown|Labor Costs|Labour Costs|Total Estimate|Project Timeline|Material Details & Calculations|Notes & Terms|Client Name|Project Address|Payment Terms|Warranty Information)$/gim,
      (_, cap) => `\n\n### ${cap}\n`
    );

    // 5. FORCE bullet points for Scope of Work and similar sections
    // For these sections, convert strings split by newlines into a bullet list, unless they're tables:
    function bulletSection(sectionTitle: string) {
      const regex = new RegExp(`(### ${sectionTitle}\\n)([^#\\n\\|][\\s\\S]*?)(?=\\n### |\\n## |$)`, "g");
      content = content.replace(regex, (_, heading, body) => {
        // If body already contains a list or table, leave as is
        if (body.match(/^[\*\-\d]+\s+/m) || body.match(/^\|/m)) return heading + body;
        // Otherwise, split lines into clean bullets (filter out empty)
        const lines = body
          .split("\n")
          .map(l => l.trim())
          .filter(l => l.length > 0);
        if (lines.length === 0 || lines.join("").length > 250) return heading + body;
        return (
          heading +
          "\n" +
          lines.map(l => `- ${l.replace(/^\-?\s*/, "")}`).join("\n") +
          "\n"
        );
      });
    }
    bulletSection("Scope of Work");
    bulletSection("Material Details & Calculations");
    bulletSection("Notes & Terms");

    // 6. Create a better formatted total estimate section
    content = content.replace(
      /(### Total Estimate\n)([^#]*?)(?=\n### |\n## |$)/g,
      (_, heading, body) => {
        // If the total estimate section already contains a properly formatted table, leave it as is
        if (body.includes("| Description | Amount |") || body.includes("total-project-cost-block")) {
          return heading + body;
        }

        // Extract total project cost from the content if it exists
        const totalMatch = body.match(/Total Project Cost:?\s*\$([0-9,]+\.\d{2}|\d+)/i);
        const totalAmount = totalMatch ? totalMatch[1] : "";

        // Extract other costs from the content
        const lines = body
          .split("\n")
          .map(line => line.trim())
          .filter(line => line.length > 0);

        // Build a proper table for the total estimate section
        let tableRows = [];
        
        // Add table headers
        tableRows.push("| Description | Amount (NZD) |");
        tableRows.push("|-------------|-------------|");
        
        // Process each line to extract description and amount
        lines.forEach(line => {
          const match = line.match(/(.*?)(?:\:|\s+)?\$?([0-9,]+\.\d{2}|\d+)$/);
          if (match) {
            const description = match[1].trim();
            const amount = match[2].trim();
            
            if (description.toLowerCase().includes("total project cost")) {
              // Skip this line as we'll add it separately at the end
            } else {
              tableRows.push(`| ${description} | $${amount} |`);
            }
          }
        });
        
        // Add the total project cost at the end if found
        if (totalAmount) {
          tableRows.push("\n<span class=\"total-project-cost-block\">Total Project Cost: $" + totalAmount + "</span>\n");
        }
        
        return heading + "\n" + tableRows.join("\n") + "\n";
      }
    );

    // 7. Enhance tables: right align numbers, strong header, styled subtotal/total lines
    content = content.replace(
      /^\|(.*?)\|(.*?)\|$/gm,
      (match, desc, amount) => {
        // Skip if this is a header or separator row
        if (match.includes("---") || match.toLowerCase().includes("description") || match.toLowerCase().includes("amount")) {
          return match;
        }
        
        // Check if this is a totals or subtotals row
        if (desc.toLowerCase().includes("subtotal") || 
            desc.toLowerCase().includes("total") || 
            desc.toLowerCase().includes("gst") || 
            desc.toLowerCase().includes("margin")) {
          return `|<span class="subtotal-cell">${desc}</span>|<span class="subtotal-cell">${amount}</span>|`;
        }
        
        return match;
      }
    );

    // 8. Insert orange divider above Total Estimate section
    content = content.replace(
      /(### Total Estimate|<span class="section-number">[0-9]+<\/span>Total Estimate)/,
      '<hr class="orange-divider"/>\n$1'
    );

    // 9. Clean up extra whitespace, excess blank lines, ensure nice section spacing.
    content = content.replace(/\n{3,}/g, "\n\n");
    content = content.trim();

    return content;
  }, [rawMarkdown]);
}
