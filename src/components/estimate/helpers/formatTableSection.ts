
/**
 * Table formatting for tabbed sections (unchanged from original, just modularized).
 */
export function formatTableSection(sectionHeader: string, content: string) {
  const regex = new RegExp(`(### ${sectionHeader}[\\s\\S]*?)((?:^\\s*[\\w\\s]+\\t.*$\\n?)+)`, "gmi");
  return content.replace(regex, (match, header, tableContent) => {
    if (tableContent.includes("|")) return match;
    const rows = tableContent.trim().split("\n");
    if (!rows.length) return match;
    const headers = rows[0].split("\t").filter(Boolean).map(h => h.trim());
    if (headers.length <= 1) return match;
    let markdownTable = "\n";
    markdownTable += `| ${headers.join(" | ")} |\n`;
    markdownTable += `| ${headers.map(() => "---").join(" | ")} |\n`;
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].split("\t").filter(Boolean).map(c => c.trim());
      while (cells.length < headers.length) cells.push("");
      markdownTable += `| ${cells.join(" | ")} |\n`;
    }
    return header + markdownTable;
  });
}
