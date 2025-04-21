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

    // 6. Enhance tables: right align numbers, strong header, styled subtotal/total lines
    // This is mostly handled by the CSS, but clarify subtotal/total rows in markdown:
    content = content.replace(
      /^(\|\s*(?:Materials|Labor|Labour|Total Project Cost|Total Estimate|Materials \+ 15% GST|Labor \+ 15% GST|Materials \+ 18% Builders Margin|Labor Subtotal|Materials Subtotal).*?\|)$/gim,
      match =>
        match
          .replace(/(\*\*[^(|]+?\*\*)/, m => `<strong>${m.replace(/\*\*/g, "")}</strong>`)
          .replace(/(\|.*\$[\d,.]+\s*\|)$/g, cell => `<span class="subtotal-cell">${cell}</span>`)
    );

    // 7. Insert orange divider above Total Estimate section
    content = content.replace(
      /(<span class="section-number">[0-9]+<\/span>Total Estimate)/,
      '<hr class="orange-divider"/>\n$1'
    );

    // 8. Make total project cost stand out! Look for "Total Project Cost" or "Total Estimate" row, and extract value:
    const totalMatch = content.match(/Total Project Cost.*?\$([0-9,]+\.\d{2}|\d+)/);
    if (totalMatch) {
      const rawAmount = totalMatch[1];
      content = content.replace(
        /(Total Project Cost.*?\$[0-9,]+\.\d{2}|\$[0-9,]+)/g,
        m =>
          m.includes("Total Project Cost")
            ? `<span class="total-project-cost-block">Total Project Cost: $${rawAmount}</span>`
            : m
      );
    }

    // 9. Clean up extra whitespace, excess blank lines, ensure nice section spacing.
    content = content.replace(/\n{3,}/g, "\n\n");
    content = content.trim();

    return content;
  }, [rawMarkdown]);
}
