
/**
 * Utilities for recognizing and processing markdown sections for renderer.
 */

export type SectionHeaderTest = (content: string) => boolean;

export function isHeadingElement(child: any) {
  // react-markdown passes nodes with .type === "heading"
  return Boolean(child && child.props && child.props.node && child.props.node.type === "heading");
}

export function isMatchingHeader(child: any, headerTest: SectionHeaderTest) {
  if (!isHeadingElement(child)) return false;
  const childrenProps = child.props.children;
  if (Array.isArray(childrenProps)) {
    const firstChild = childrenProps[0];
    if (firstChild && typeof firstChild.props?.value === "string") {
      return headerTest(firstChild.props.value);
    }
  }
  return false;
}

export function extractParagraphTexts(children: React.ReactNode) {
  const bullets: string[] = [];
  let insideSection = false;
  let headerIdx = -1;
  React.Children.forEach(children, (child, idx) => {
    if (!child || typeof child !== "object" || !("props" in child)) return;
    const nodeProps = (child as any).props?.node;
    // Identify header start
    if (nodeProps?.type === "heading") {
      insideSection = true;
      headerIdx = idx;
    } else if (insideSection && nodeProps?.type === "paragraph") {
      // Aggregate only paragraphs after header
      const paragraphChildren = (child as any).props.children;
      if (!paragraphChildren) return;
      const arr = Array.isArray(paragraphChildren) ? paragraphChildren : [paragraphChildren];
      const text = arr.map((val: any) =>
        typeof val === "string"
          ? val.trim()
          : typeof val?.props?.value === "string"
            ? val.props.value.trim()
            : ""
      ).filter(Boolean).join(" ");
      if (text) bullets.push(text);
    }
  });
  return { headerIdx, bullets };
}
