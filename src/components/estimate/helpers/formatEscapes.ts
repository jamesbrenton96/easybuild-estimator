
/**
 * Cleans up escaped newlines/tabs/quotes for markdown.
 */
export function formatEscapes(content: string) {
  return content
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "    ")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}
