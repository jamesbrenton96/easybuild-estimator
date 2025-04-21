
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
      /^(Project Overview|Scope of Work|Dimensions|Materials & Cost Breakdown|Material Cost Breakdown|Labor Costs|Labour Costs|Labor Cost Breakdown|Total Estimate|Total Project Cost|Project Timeline|Material Details & Calculations|Notes & Terms|Client Name|Project Address|Payment Terms|Warranty Information)$/gim,
      (_, cap) => `\n\n### ${cap}\n`
    );

    // 5. FORCE bullet points for specific sections
    function bulletSection(sectionTitle: string) {
      const regex = new RegExp(`(### ${sectionTitle}\\n)([^#\\n\\|][\\s\\S]*?)(?=\\n### |\\n## |$)`, "gi");
      content = content.replace(regex, (_, heading, body) => {
        // If body already contains a list or table, leave as is
        if (body.match(/^[\*\-\d]+\s+/m) || body.match(/^\|/m)) return heading + body;
        
        // Otherwise, split lines into clean bullets (filter out empty)
        const lines = body
          .split("\n")
          .map(l => l.trim())
          .filter(l => l.length > 0 && !l.includes("Total Project Cost") && !l.includes("TOTAL PROJECT COST"));
          
        if (lines.length === 0) return heading + body;
        
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
    bulletSection("Dimensions");
    bulletSection("Project Timeline");

    // 6. Fix table formatting - first ensure proper markdown table structure for all tables
    function formatTableSection(sectionHeader) {
      const regex = new RegExp(`(### ${sectionHeader}[\\s\\S]*?)((?:^\\s*[\\w\\s]+\\t.*$\\n?)+)`, "gmi");
      content = content.replace(regex, (match, header, tableContent) => {
        if (tableContent.includes("|")) return match; // Already in table format
        
        // Split into rows
        const rows = tableContent.trim().split("\n");
        if (rows.length === 0) return match;
        
        // Get headers from first row
        const headers = rows[0].split("\t").filter(Boolean).map(h => h.trim());
        if (headers.length <= 1) return match;
        
        // Build proper table
        let markdownTable = "\n";
        markdownTable += `| ${headers.join(" | ")} |\n`;
        markdownTable += `| ${headers.map(() => "---").join(" | ")} |\n`;
        
        // Add data rows
        for (let i = 1; i < rows.length; i++) {
          const cells = rows[i].split("\t").filter(Boolean).map(c => c.trim());
          if (cells.length > 0) {
            // Make sure we have enough cells to match headers
            while (cells.length < headers.length) cells.push("");
            markdownTable += `| ${cells.join(" | ")} |\n`;
          }
        }
        
        return header + markdownTable;
      });
    }
    
    formatTableSection("Labor Costs");
    formatTableSection("Labour Costs");
    formatTableSection("Labor Cost Breakdown");
    formatTableSection("Materials & Cost Breakdown");
    formatTableSection("Material Cost Breakdown");
    formatTableSection("Total Estimate");
    formatTableSection("Total Project Cost");

    // 7. Create a better formatted total estimate section
    content = content.replace(
      /(### Total (Estimate|Project Cost)\n)([^#]*?)(?=\n### |\n## |$)/gi,
      (_, heading, type, body) => {
        // If the total estimate section already contains a properly formatted table, leave it as is
        if (body.includes("| Description | Amount |") || body.includes("total-project-cost-block")) {
          return heading + body;
        }

        // Extract total project cost from the content if it exists
        const totalMatch = body.match(/Total Project Cost:?\s*\$([0-9,]+\.\d{2}|\d+)/i);
        const totalAmount = totalMatch ? totalMatch[1] : "";

        // Process the body to extract table rows
        let tableRows = [];
        const lines = body
          .split("\n")
          .map(line => line.trim())
          .filter(Boolean);
          
        if (lines.length > 0) {
          // Add table headers
          tableRows.push("| Description | Amount (NZD) |");
          tableRows.push("|-------------|-------------|");
          
          // Process each line to extract description and amount
          lines.forEach(line => {
            // Look for patterns like "Materials: $XXX" or lines with tabs
            const match = line.match(/(.*?)(?:\:|\s+)?\$?([0-9,]+\.\d{2}|\d+)$/);
            if (match) {
              const description = match[1].trim();
              const amount = match[2].trim();
              
              if (description.toLowerCase().includes("total project cost")) {
                // Skip this for now as we'll add it at the end
              } else {
                tableRows.push(`| ${description} | $${amount} |`);
              }
            } else if (line.includes("\t")) {
              // Handle tab-separated lines
              const parts = line.split("\t").filter(Boolean);
              if (parts.length >= 2) {
                const description = parts[0].trim();
                const lastPart = parts[parts.length - 1].trim();
                // Extract amount with $ sign if present
                const amountMatch = lastPart.match(/\$?([0-9,]+\.\d{2}|\d+)/);
                if (amountMatch) {
                  tableRows.push(`| ${description} | $${amountMatch[1]} |`);
                }
              }
            }
          });
          
          // Add the total project cost at the end if found
          if (totalAmount) {
            tableRows.push(`| **TOTAL PROJECT COST** | **$${totalAmount}** |`);
          }
          
          // If we found no rows but have a total, at least show that
          if (tableRows.length <= 2 && totalAmount) {
            tableRows.push(`| **TOTAL PROJECT COST** | **$${totalAmount}** |`);
          }
        }

        // If we have a good table, return it
        if (tableRows.length > 2) {
          return heading + "\n" + tableRows.join("\n") + "\n\n";
        }
        
        // Otherwise return original content with a better total block
        if (totalAmount) {
          return heading + "\n<span class=\"total-project-cost-block\">Total Project Cost: $" + totalAmount + "</span>\n\n";
        }
        
        return heading + body;
      }
    );

    // 8. Process subtotal-cell spans to make proper tables
    content = content.replace(
      /(<span class="subtotal-cell">[^<]*<\/span>[\s\t]*<span class="subtotal-cell">[^<]*<\/span>)/gm,
      (match) => {
        // Extract description and amount from the span tags
        const descMatch = match.match(/<span class="subtotal-cell">([^<]*)<\/span>/);
        const amountMatch = match.match(/<span class="subtotal-cell">([^<]*)<\/span>(?!.*<span class="subtotal-cell">)/);
        
        if (descMatch && amountMatch) {
          const desc = descMatch[1].trim();
          const amount = amountMatch[1].trim();
          
          // Create a proper markdown table row
          return `| <span class="subtotal-cell">${desc}</span> | <span class="subtotal-cell">${amount}</span> |`;
        }
        
        return match;
      }
    );

    // 9. Convert numbered subtotal groups into proper sections
    content = content.replace(
      /^(\d+)\.\s+(<span class="subtotal-cell">.*$)/gm,
      (_, num, line) => `\n## <span class="section-number">${num}</span>Cost Breakdown\n\n${line}`
    );

    // 10. Ensure consistent table format for subtotal cells
    content = content.replace(
      /(<span class="subtotal-cell">.*<\/span>.*<span class="subtotal-cell">.*<\/span>)/gm,
      (match) => {
        if (match.includes("|")) return match; // Already in table format
        
        // Split into parts
        const parts = match.split(/\s+/).filter(Boolean);
        
        // Try to identify description and amount parts
        let description = "";
        let amount = "";
        
        for (const part of parts) {
          if (part.includes("$") || part.match(/\d+\.\d+/)) {
            amount = part;
          } else if (part.includes("subtotal-cell")) {
            if (!description) {
              description = part;
            } else if (!amount) {
              amount = part;
            }
          }
        }
        
        if (description && amount) {
          return `| ${description} | ${amount} |`;
        }
        
        return match;
      }
    );

    // 11. Insert orange divider above Total Estimate section
    content = content.replace(
      /(### Total (Estimate|Project Cost)|<span class="section-number">[0-9]+<\/span>Total (Estimate|Project Cost))/i,
      '<hr class="orange-divider"/>\n$1'
    );

    // 12. Handle numbered bullet points in Notes & Terms section
    content = content.replace(
      /(### Notes & Terms\n)([^#\n][^]*?)(?=\n### |\n## |$)/gi,
      (_, heading, body) => {
        // Process each line to check for numbered items
        const lines = body.trim().split("\n");
        const formattedLines = lines.map((line, index) => {
          // Check if this line starts with a number (like "1. Text" or "1) Text")
          const numberMatch = line.match(/^(\d+)[\.\)]\s*(.*)/);
          if (numberMatch) {
            // Replace with section-number span
            return `<span class="section-number">${numberMatch[1]}</span>${numberMatch[2]}`;
          }
          
          // Check if it has a <span class="section-number"> already
          if (line.includes('<span class="section-number">')) {
            return line; // Already formatted
          }
          
          return line;
        });
        
        return heading + formattedLines.join('\n') + '\n';
      }
    );

    // 13. Clean up extra whitespace, excess blank lines, ensure nice section spacing.
    content = content.replace(/\n{3,}/g, "\n\n");
    content = content.trim();

    return content;
  }, [rawMarkdown]);
}
