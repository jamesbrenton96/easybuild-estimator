
/**
 * For each provided section, ensure bullet formatting, unless bullets or tables already exist.
 */
export function bulletSection(sectionTitle: string, content: string) {
  const regex = new RegExp(`(### ${sectionTitle}\\n)([^#\\n\\|][\\s\\S]*?)(?=\\n### |\\n## |$)`, "gi");
  return content.replace(regex, (_, heading, body) => {
    // Already has bullets or tables
    if (body.match(/^[\*\-\d]+\s+/m) || body.match(/^\|/m) || body.includes('section-number')) return heading + body;
    // Split to clean bullets
    const lines = body
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.includes("Total Project Cost") && !l.includes("TOTAL PROJECT COST"));
    if (!lines.length) return heading + body;
    return (
      heading +
      "\n" +
      lines.map(l => (l.includes('section-number') ? l : `- ${l.replace(/^\-?\s*/, "")}`)).join("\n") +
      "\n"
    );
  });
}
