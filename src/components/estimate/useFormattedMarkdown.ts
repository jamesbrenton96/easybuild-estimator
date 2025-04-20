
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

    // Fix issues with escaped newlines, tabs, etc
    cleaned = cleaned
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "    ")
      .replace(/\\"/g, "\"")
      .replace(/\\\\/g, "\\");

    // Add an extra newline before headers for spacing
    cleaned = cleaned.replace(/([^\n])(\n#+\s)/g, '$1\n$2');
    cleaned = cleaned.replace(/(#+\s)/g, '\n$1');

    // Add a blank line before tables for better spacing if not present
    cleaned = cleaned.replace(/([^\n])(\n\|)/g, '$1\n$2');
    cleaned = cleaned.replace(/(\n\|.*\|\n)/g, '\n$1');
    // Condense multiple blank lines
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    // Bold "Total Project Cost" lines in tables & summary
    cleaned = cleaned.replace(/(\*\*Total Project Cost\*\*|Total Project Cost|Total Estimate)/g, match => 
      `**${match.replace(/\*\*/g, "")}**`);

    // Make bold headings for Materials/Labor subtotals, Grand Total, etc
    cleaned = cleaned.replace(
      /(Materials(?: Subtotal)?(?: \(including GST and Builder'?s? Margin\))?|Labor(?: Subtotal)?(?: \(including GST\))?)/g,
      match => `**${match}**`
    );

    // Tidy currency lines: align sums bold, normalise $/NZD, fix decimals
    cleaned = cleaned.replace(/\| (NZD )?\$\d+(,\d{3})*(\.\d{2})? /g, v => v.replace(/ /g, ''));

    // Clean up summary at the end ("6. Total"/"Total Estimate" etc) by adding tables or colored boxes
    cleaned = cleaned.replace(/^(##?\s*6\.\s*Total( Estimate)?|##?\s*Total( Estimate)?)/gim, '\n---\n$1');
    cleaned = cleaned.replace(/^(\|.*?Total.*?\|.*?\|)$/gim, '\n$1\n');

    // Add extra newlines before bolded total/cost lines (for Markdown spacing)
    cleaned = cleaned.replace(/(\n\*\*[^*]+\*\*\n?)/g, '\n$1');

    // Add subtle section anchors to "Material Details", "Notes & Terms"
    cleaned = cleaned.replace(/(##?\s*7\.[^\n]+|##?\s*Material Details[^\n]*)/g, "\n$1\n");
    cleaned = cleaned.replace(/(##?\s*8\.[^\n]+|##?\s*Notes[^\n]*)/g, "\n$1\n");

    // Finally, trim any excess leading/trailing whitespace
    cleaned = cleaned.trim();

    return cleaned;
  }, [markdownContent]);
}
