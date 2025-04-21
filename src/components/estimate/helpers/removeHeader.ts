
/**
 * Removes the top header from markdown if present.
 */
export function removeHeader(content: string) {
  return content.replace(/^# (Project Cost Estimate|Construction Cost Estimate).*\n*/i, "");
}
