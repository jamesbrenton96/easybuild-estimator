
import { useMemo } from "react";

/**
 * useProMarkdownEstimate - Enhanced markdown formatter for construction estimates.
 * Features:
 *  - Formats all main sections with bold, orange, prominent headings (h2/h3).
 *  - Converts all cost, subtotal, total, and summary blocks to tables with Orange/bold total rows.
 *  - Keeps markdown tables intact, but improves subtotal/total emphasis.
 *  - Cleans up inconsistent whitespace and ensures section separation.
 *  - Returns a single, highly readable markdown string.
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

    // 2. Convert all sections (numbered or named) into BIG orange headings
    content = content.replace(
      /^([0-9]+\.\s[^\n]+)$/gm,
      (_match, cap) =>
        `\n<span style="font-size:1.6em;font-weight:800;color:#ff8600;display:block;margin:2em 0 0.6em 0;">${cap}</span>`
    );
    content = content.replace(
      /^(Project Overview|Scope of Work|Dimensions|Materials & Cost Breakdown|Material Cost Breakdown|Labor Costs|Labour Costs|Total Estimate|Project Timeline|Material Details & Calculations|Notes & Terms|Client Name|Project Address)$/gim,
      (_m, cap) =>
        `\n<span style="font-size:1.3em;font-weight:700;color:#ff8600;display:block;margin:1.5em 0 0.3em;">${cap}</span>`
    );
    // Remove accidental hash headers if present
    content = content.replace(/^(#+)\s*([0-9]+\.)/gm, (_m, _h, cap) => cap);

    // 3. Find cost summary lines (Subtotals, GST, Margin, Totals) not already in tables and make them colored bold in their own row
    // Handle: "| Materials Subtotal | ... |" etc. Already in table: apply orange
    content = content.replace(
      /^(\| ?)([^|\n]*(Subtotal|GST|Margin|Total).*?)(\|[^\n]+)\|?$/gim,
      (_m, p1, label, _k, trailing) =>
        `| <span style="color:#ff8600;font-weight:700;">${label.trim()}</span> ${trailing}|`
    );
    // For rows like "| ... | ... | 82.50 |" at end of labor/materials section - make last row orange if 'total' in label
    content = content.replace(
      /^(\| ?)([^|\n]*Total Project Cost[^|\n]*)(\|[^\n]+)\|?$/gim,
      (_m, p1, label, trailing) =>
        `| <span style="color:#e36414;font-weight:700;font-size:1.1em;">${label.trim()}</span> ${trailing}|`
    );

    // 4. Convert cost summary lines (not inside tables) into their own markdown table if not already
    // For: "Materials Subtotal: $1,197.62"
    content = content.replace(
      /^([\w ().'%/+&-]+(?:Subtotal|GST|Margin|Total)[^:]*):?\s*\$([0-9,]+(\.\d{2})?)$/gim,
      (_m, label, value) =>
        `| <span style="color:#ff8600;font-weight:700;">${label.trim()}</span> | <span style="color:#ff8600;font-weight:700;">$${value}</span> |\n|---|---|`
    );

    // 5. Add extra blank lines before/after tables and prominent headings for spacing
    content = content.replace(/([^\n])(\n\|)/g, "$1\n$2");
    content = content.replace(/(\n\|.*\|\n)/g, "\n$1");
    content = content.replace(/\n{3,}/g, "\n\n");

    // 6. Make sure "Total Project Cost" and similar lines (not in tables) become tables too
    content = content.replace(
      /^\*\*([^*]+Total Project Cost[^*]+)\*\*\s+\$([0-9,.]+)/gim,
      (_m, label, value) =>
        `| <span style="color:#e36414;font-weight:700;">${label.trim()}</span> | <span style="color:#e36414;font-weight:700;">$${value}</span> |\n|---|---|`
    );

    // 7. Remove weird leftover extra pipe lines or trailing whitespace
    content = content.replace(/(\|[^\n]+\|)\|+/g, "$1");
    content = content.replace(/^\s+|\s+$/g, "");

    return content;
  }, [rawMarkdown]);
}
