import { useMemo } from "react";
import { formatEscapes } from "./helpers/formatEscapes";
import { removeHeader } from "./helpers/removeHeader";
import { formatSectionHeadings } from "./helpers/formatSectionHeadings";
import { bulletSection } from "./helpers/bulletSection";
import { formatTableSection } from "./helpers/formatTableSection";
import { formatTotals } from "./helpers/formatTotals";
import { formatThankYou } from "./helpers/formatThankYou";

/**
 * useProMarkdownEstimate - Enhanced markdown formatter for construction estimates (refactored).
 * "Notes & Terms" remains as plain text; no bullets/headings/styling for that section.
 */
export function useProMarkdownEstimate(rawMarkdown: string) {
  return useMemo(() => {
    if (!rawMarkdown) return "";

    let content = rawMarkdown;

    // 1. Clean up escapes
    content = formatEscapes(content);

    // 2. Remove estimate header
    content = removeHeader(content);

    // 3/4. Format major/known section headings
    content = formatSectionHeadings(content);

    // 5. Bullet points for select sections (skip Notes & Terms)
    ["Scope of Work", "Material Details & Calculations", "Dimensions", "Project Timeline"].forEach(section => {
      content = bulletSection(section, content);
    });

    // 6. Table formatting for tabbed sections
    [
      "Labor Costs", "Labour Costs", "Labor Cost Breakdown",
      "Materials & Cost Breakdown", "Material Cost Breakdown",
      "Total Estimate", "Total Project Cost",
    ].forEach(section => {
      content = formatTableSection(section, content);
    });

    // 7. Format total estimate section
    content = formatTotals(content);

    // 8-11: Subtotal cells, subtotal groups, table formats, orange divider
    // These cases are rare and isolated; keep here for now.
    // (Lines from original below for in-place clarity)
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

    // 12. Remove any "### Notes & Terms" heading if present.
    content = content.replace(/^### (Notes & Terms|NOTES & TERMS)[^\n]*\n?/gim, "");

    // 13. Thank You section
    content = formatThankYou(content);

    // Clean up excess blank lines and spacing.
    content = content.replace(/\n{3,}/g, "\n\n").trim();

    return content;
  }, [rawMarkdown]);
}
