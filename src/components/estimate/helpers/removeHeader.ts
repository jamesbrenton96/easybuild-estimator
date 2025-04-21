
/**
 * Removes the top header from markdown if present.
 * Now also removes specific project header patterns.
 */
export function removeHeader(content: string) {
  // Remove any standard estimate headers
  let result = content.replace(/^# (Project Cost Estimate|Construction Cost Estimate).*\n*/i, "");
  
  // Remove the specific correspondence/project header pattern
  result = result.replace(/^# \[Collection\] Correspondence.*\n*/i, "");
  
  return result;
}
