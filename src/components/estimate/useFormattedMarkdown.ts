import { useMemo } from "react";

/**
 * useFormattedMarkdown - Cleans & reformats markdown text for much more readable output.
 * This will: 
 *  - Insert extra line breaks after single/double line endings before section headers.
 *  - Add missing newlines for lists and tables.
 *  - Bold key totals.
 *  - Space tables nicely.
 *  - Tidy up number and currency columns.
 *
 * @param markdownContent string - incoming content directly from webhook/service.
 * @returns cleaned/beautified markdown string
 */
export function useFormattedMarkdown(markdownContent: string) {
  return useMemo(() => {
    if (!markdownContent) return "";

    let cleaned = markdownContent;

    // Fix basic escaped newlines/tabs/quotes
    cleaned = cleaned
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "    ")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");

    // --- Smart Block Table Enhancements ---

    // 1. Convert numeric summary lines into table rows if not already in tables
    // e.g., lines like "Materials Subtotal: $XXX", "Materials + 15% GST: $XXX" => one neat summary table
    // First, gather summary-like lines. We'll do this per section.
    function blockSummaryToTable(text: string): string {
      // Find blocks with >2 summary lines (eg. lines with colon or |)
      return text.replace(
        /((?:^\s*(?:[A-Za-z ().'%/+-]+?)(:|–|-)?\s*\$[0-9,]+(\.\d{2})?\s*$\n?){2,})/gm,
        block => {
          // Split block into lines, strip, skip non-matching
          const rows = block
            .split("\n")
            .map(l => l.trim())
            .filter(Boolean)
            .map(line => {
              // Try to split at first colon or dash or en-dash after label
              let sep = line.indexOf(":") > 0 ? ":" : line.match(/–|-/) ? line.match(/–|-/)![0] : null;
              if (sep) {
                let [label, val] = line.split(sep, 2);
                return `| ${label.trim()} | ${val.replace(/^[$ ]+/, "$ ").trim()} |`;
              }
              // If it's already pipe separated
              if (line.includes("|")) return line;
              // Otherwise, look for $ in the line
              const dollar = line.indexOf("$");
              if (dollar > 0)
                return `| ${line.slice(0, dollar).trim()} | $ ${line.slice(dollar + 1).trim()} |`;
              return null;
            })
            .filter(Boolean);
          if (!rows.length) return block;
          // Add header and fence, unless already a table
          if (rows[0].includes("|") && rows.length > 1 && !rows[0].startsWith("| Label")) {
            rows.unshift("| Label | Amount |");
            rows.splice(1, 0, "|-------|--------|");
          }
          return "\n" + rows.join("\n") + "\n";
        }
      );
    }
    cleaned = blockSummaryToTable(cleaned);

    // 2. Convert single-line cost lines in sections (not inside tables, e.g. "**Total Project Cost**   $2,438.59")
    cleaned = cleaned.replace(
      /^(\*\*[A-Za-z ().'%/+-]+?\*\*)\s+\$([0-9,]+(\.\d{2})?)/gm,
      (_match, p1, p2) =>
        `\n| ${p1.replace(/\*\*/g, "")} | $ ${p2} |\n|---------------------|----------|\n| **${p1.replace(/\*\*/g, "")}** | **$ ${p2}** |\n`
    );

    // Add an extra newline before headers for spacing
    cleaned = cleaned.replace(/([^\n])(\n#+\s)/g, "$1\n$2");
    cleaned = cleaned.replace(/(#+\s)/g, "\n$1");

    // Add a blank line before tables if not present
    cleaned = cleaned.replace(/([^\n])(\n\|)/g, "$1\n$2");
    cleaned = cleaned.replace(/(\n\|.*\|\n)/g, "\n$1");
    // Condense multiple blank lines
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

    // Bold "Total Project Cost" and similar summary headings
    cleaned = cleaned.replace(/(\*\*Total Project Cost\*\*|Total Project Cost|Total Estimate)/g, match =>
      `**${match.replace(/\*\*/g, "")}**`
    );

    // Make bold headings for Materials/Labor subtotals, Grand Total, etc
    cleaned = cleaned.replace(
      /(Materials(?: Subtotal)?(?: \(including GST and Builder'?s? Margin\))?|Labor(?: Subtotal)?(?: \(including GST\))?)/g,
      match => `**${match}**`
    );

    // Tidy currency lines in tables for $/NZD
    cleaned = cleaned.replace(/\| (NZD )?\$\d+(,\d{3})*(\.\d{2})? /g, v => v.replace(/ /g, ""));

    // Clean up summary at the end ("6. Total"/"Total Estimate" etc) by adding tables or colored boxes
    cleaned = cleaned.replace(/^(##?\s*6\.\s*Total( Estimate)?|##?\s*Total( Estimate)?)/gim, "\n---\n$1");
    cleaned = cleaned.replace(/^(\|.*?Total.*?\|.*?\|)$/gim, "\n$1\n");

    // Add extra newlines before bolded total/cost lines (for Markdown spacing)
    cleaned = cleaned.replace(/(\n\*\*[^*]+\*\*\n?)/g, "\n$1");

    // Add subtle section anchors to "Material Details", "Notes & Terms"
    cleaned = cleaned.replace(/(##?\s*7\.[^\n]+|##?\s*Material Details[^\n]*)/g, "\n$1\n");
    cleaned = cleaned.replace(/(##?\s*8\.[^\n]+|##?\s*Notes[^\n]*)/g, "\n$1\n");

    // Trim any excess leading/trailing whitespace
    cleaned = cleaned.trim();

    return cleaned;
  }, [markdownContent]);
}
