
import { useMemo } from "react";
import { formatEscapes } from "./helpers/formatEscapes";
import { removeHeader } from "./helpers/removeHeader";
import { formatSectionHeadings } from "./helpers/formatSectionHeadings";
import { bulletSection } from "./helpers/bulletSection";
import { formatTableSection } from "./helpers/formatTableSection";
import { formatTotals } from "./helpers/formatTotals";
import { formatThankYou } from "./helpers/formatThankYou";
import { formatNotesAndTerms } from "./helpers/formatNotesAndTerms";

/**
 * useProMarkdownEstimate - Enhanced markdown formatter for construction estimates (refactored).
 * Notes & Terms section is specially formatted with extra spacing between items and no numbers.
 */
export function useProMarkdownEstimate(rawMarkdown: string) {
  return useMemo(() => {
    if (!rawMarkdown) return "";

    let content = rawMarkdown;

    // 1. Clean up escapes
    content = formatEscapes(content);

    // 2. Remove estimate header (& correspondence/project header)
    content = removeHeader(content);

    // 3/4. Format major/known section headings
    content = formatSectionHeadings(content);

    // 5. Bullet points for select sections (skip Notes & Terms)
    ["Scope of Work", "Material Details & Calculations", "Dimensions", "Project Timeline"].forEach(section => {
      content = bulletSection(section, content);
    });

    // 6. Format Notes and Terms section - enhanced to completely remove numbering
    const notesTermsPattern = /(?:^|\n)(#+\s*NOTES\s+AND\s+TERMS\s*(?:\n|$))([\s\S]*?)(?=\n#+\s*|$)/i;
    const notesTermsMatch = content.match(notesTermsPattern);
    
    if (notesTermsMatch && notesTermsMatch[2]) {
      // Apply more aggressive formatting to completely remove all numbers
      let formattedNotesTerms = formatNotesAndTerms(notesTermsMatch[2]);
      
      // Additional cleanup to ensure all number patterns are removed
      formattedNotesTerms = formattedNotesTerms
        // Remove all number + punctuation patterns at line starts
        .replace(/^\d+[\.\:\)\s]+\s*/gm, '')
        // Remove formats like "2. PAYMENT TERMS:" at line starts
        .replace(/^\d+\.\s+([A-Z]+\s+[A-Z]+\:)/gm, '$1')
        // Remove remnant numbers that might be at the start of lines
        .replace(/^(\d+)[\.:\)\s]+/gm, '')
        // Final cleanup of any stragglers
        .replace(/^\s*\d+[\.\:\)\-\s]/gm, '');
      
      // Replace the section with fully cleaned version
      content = content.replace(notesTermsMatch[0], notesTermsMatch[1] + formattedNotesTerms);
    }

    // 7. Table formatting for tabbed sections
    [
      "Labor Costs", "Labour Costs", "Labor Cost Breakdown",
      "Materials & Cost Breakdown", "Material Cost Breakdown",
      "Total Estimate", "Total Project Cost",
    ].forEach(section => {
      content = formatTableSection(section, content);
    });

    // 8. Format total estimate section
    content = formatTotals(content);

    // 9. Process the Thank You section
    content = formatThankYou(content);

    // 10-13: Subtotal cells, subtotal groups, table formats, orange divider, etc.
    content = content.replace(
      /(<span class="subtotal-cell">[^<]*<\/span>[\s\t]*<span class="subtotal-cell">[^<]*<\/span>)/gm,
      (match) => {
        const descMatch = match.match(/<span class="subtotal-cell">([^<]*)<\/span>/);
        const amountMatch = match.match(/<span class="subtotal-cell">([^<]*)<\/span>(?!.*<span class="subtotal-cell">)/);
        if (descMatch && amountMatch) {
          const desc = descMatch[1].trim();
          const amount = amountMatch[1].trim();
          return `| <span class="subtotal-cell">${desc}</span> | <span class="subtotal-cell">${amount}</span> |`;
        }
        return match;
      }
    );
    
    content = content.replace(
      /^(\d+)\.\s+(<span class="subtotal-cell">.*$)/gm,
      (_, num, line) => `\n## <span class="section-number">${num}</span>Cost Breakdown\n\n${line}`
    );
    
    content = content.replace(
      /(<span class="subtotal-cell">.*<\/span>.*<span class="subtotal-cell">.*<\/span>)/gm,
      (match) => {
        if (match.includes("|")) return match;
        const parts = match.split(/\s+/).filter(Boolean);
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
    
    content = content.replace(
      /(### Total (Estimate|Project Cost)|<span class="section-number">[0-9]+<\/span>Total (Estimate|Project Cost))/i,
      '<hr class="orange-divider"/>\n$1'
    );

    // Clean up excess blank lines and spacing.
    content = content.replace(/\n{3,}/g, "\n\n").trim();

    return content;
  }, [rawMarkdown]);
}
