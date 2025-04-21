
import { useMemo } from "react";

/**
 * Splits markdown into sections, applies better heading formatting, 
 * and converts number blocks into tables for consistent, readable output.
 */
export function useSectionedEstimateMarkdown(markdownContent: string) {
  return useMemo(() => {
    if (!markdownContent) return "";

    let content = markdownContent;

    // 1. Enhance major section headers (numbered + non-numbered), making them H2 or clearer
    content = content.replace(
      /^([0-9]+\. [^\n]+)$/gm,
      (match) => `\n## ${match.trim()}\n`
    );
    content = content.replace(
      /^(Materials & Cost Breakdown|Labor Costs|Labour Costs|Total Estimate|Project Overview|Material Details & Calculations|Notes & Terms|Project Timeline)$/gim,
      (match) => `\n## ${match.trim()}\n`
    );
    // Bonus: ensure a blank line before any new heading
    content = content.replace(/([^\n])(\n## )/g, "$1\n$2");

    // 2. Turn orphan number summary lines into table blocks (for summary, subtotals)
    // e.g. "Materials Subtotal: $XXX" → table row(s)
    content = content.replace(
      /((?:^(?:[\w ().'%/+&-]+?)(:|–|-)?\s*\$[0-9,]+(\.\d{2})?\s*$\n?){2,})/gm,
      block => {
        const rows = block
          .split("\n")
          .map(l => l.trim())
          .filter(Boolean)
          .map(line => {
            let sep = line.indexOf(":") > 0
              ? ":"
              : line.match(/–|-/)
                ? line.match(/–|-/)![0]
                : null;
            if (sep) {
              let [label, val] = line.split(sep, 2);
              return `| ${label.trim()} | ${val.replace(/^[$ ]+/, "$ ").trim()} |`;
            }
            if (line.includes("|")) return line;
            const dollar = line.indexOf("$");
            if (dollar > 0)
              return `| ${line.slice(0, dollar).trim()} | $ ${line.slice(dollar + 1).trim()} |`;
            return null;
          })
          .filter(Boolean);
        if (!rows.length) return block;
        // Add table head and separator if not already present
        rows.unshift("| Description | Amount |");
        rows.splice(1, 0, "|---|---|");
        return "\n" + rows.join("\n") + "\n";
      }
    );

    // 3. Force lines like "**Total Project Cost**   $2,438.59" into table blocks
    content = content.replace(
      /^(\*\*[A-Za-z ().'%/+&-]+?\*\*)\s+\$([0-9,]+(\.\d{2})?)/gm,
      (_match, p1, p2) =>
        `\n| ${p1.replace(/\*\*/g, "")} | $ ${p2} |\n|---------------------|----------|\n| **${p1.replace(/\*\*/g, "")}** | **$ ${p2}** |\n`
    );

    // 4. Ensure a blank line before tables and after headings for better markdown rendering
    content = content.replace(/([^\n])(\n\|)/g, "$1\n$2");
    content = content.replace(/(\n\|.*\|\n)/g, "\n$1");

    // 5. Tidy up stray blank lines and ensure no excessive vertical space
    content = content.replace(/\n{3,}/g, "\n\n");
    content = content.trim();

    return content;
  }, [markdownContent]);
}

