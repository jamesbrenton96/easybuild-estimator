import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkdownTableStyle from "./MarkdownTableStyle";
import { CustomSpan } from "./markdown/MarkdownCustomSpans";
import MarkdownSectionBulletList from "./markdown/MarkdownSectionBulletList";
import { MarkdownTableBlock } from "./markdown/MarkdownTableBlock";
import {
  isHeadingElement,
  isMatchingHeader,
  extractParagraphTexts,
  SectionHeaderTest,
  isNumberedSectionItem,
  hasNumberedSectionItems
} from "./markdown/utils/markdownSectionUtils";

/**
 * Render markdown content with professional table and content styling.
 * This version ensures "Notes and Terms" is rendered as standard body text, never as bullet/heading/bold/orange.
 */
export default function MarkdownContentRenderer({ content }: { content: string }) {

  // Example header tests you can pass to the utilities
  const scopeOfWorkTest: SectionHeaderTest = val => /Scope of Work/i.test(val);
  const notesTest: SectionHeaderTest = val => /Notes & Terms|Notes|Terms/i.test(val);
  const correspondenceTest: SectionHeaderTest = val => /Correspondence|Client Details/i.test(val);

  // Custom section renderers (for bullet-list-like section transformation)
  function renderSection(children: React.ReactNode, headerTest: SectionHeaderTest) {
    const { headerIdx, bullets } = extractParagraphTexts(children);
    if (headerIdx !== -1 && bullets.length > 0) {
      const header = React.Children.toArray(children)[headerIdx];
      
      // Don't transform numbered section items into bullet points
      if (hasNumberedSectionItems(bullets)) {
        return children;
      }
      
      return <MarkdownSectionBulletList header={header} bulletPoints={bullets} />;
    }
    return children;
  }

  // Track if we are inside "Notes & Terms" section
  let currentSection = null;

  // Utility: Determine if a heading is for Notes & Terms
  function isNotesTermsHeading(props: any) {
    if (typeof props?.children?.[0] === "string") {
      return /Notes & Terms|NOTES & TERMS|Notes and Terms|NOTES AND TERMS/i.test(props?.children?.[0]);
    }
    return false;
  }

  return (
    <div className="p-8 markdown-content text-gray-800">
      <MarkdownTableStyle />
      <ReactMarkdown
        className="prose max-w-none 
          prose-headings:font-semibold prose-headings:mb-4
          prose-h1:text-2xl prose-h1:font-bold prose-h1:border-b prose-h1:pb-2 prose-h1:border-gray-200
          prose-h2:text-xl prose-h2:text-construction-orange prose-h2:mt-6 
          prose-h3:text-lg prose-h3:text-construction-orange prose-h3:mt-5
          prose-h4:text-base prose-h4:mt-4  
          prose-p:my-2 prose-p:leading-relaxed
          prose-a:text-blue-600 
          prose-strong:text-construction-orange prose-strong:font-semibold
          prose-li:my-1
          prose-table:w-full prose-table:my-4 
          prose-th:bg-construction-orange prose-th:text-white prose-th:p-2 prose-th:text-left
          prose-td:p-2"
        remarkPlugins={[remarkGfm]}
        components={{
          span: CustomSpan,
          table: ({ ...props }) => (
            <table className="estimate-table w-full my-6 border-collapse" {...props} />
          ),
          thead: ({ ...props }) => (
            <thead className="estimate-table-head bg-construction-orange text-white" {...props} />
          ),
          tbody: ({ ...props }) => (
            <tbody className="estimate-table-body" {...props} />
          ),
          th: ({ ...props }) => (
            <th className="estimate-table-header p-3 text-left font-bold" {...props} />
          ),
          td: ({ ...props }) => (
            <td className="estimate-table-cell p-3 border border-gray-200" {...props} />
          ),
          h2: ({ node, ...props }) => {
            // Track if we are in Notes & Terms section
            if (isNotesTermsHeading(props)) {
              currentSection = "notes-terms";
              return <h2 className="text-xl text-construction-orange mt-6 font-semibold mb-4">Notes & Terms</h2>;
            }
            currentSection = null;
            return <h2 {...props}>{props.children}</h2>;
          },
          h3: ({ node, ...props }) => {
            // Track if we are in Notes & Terms
            if (isNotesTermsHeading(props)) {
              currentSection = "notes-terms";
              return <h2 className="text-xl text-construction-orange mt-6 font-semibold mb-4">Notes & Terms</h2>;
            }
            currentSection = null;
            return <h3 {...props}>{props.children}</h3>;
          },
          p: ({ children, ...props }) => {
            // Only standard body text if in Notes & Terms
            const isInNotesTerms = currentSection === "notes-terms";
            const childrenArray = React.Children.toArray(children);
            const textContent = childrenArray.map(child =>
              typeof child === 'string' ? child : ''
            ).join('');

            // If this is a numbered item in Notes & Terms, render as plain black text
            const numberMatch = textContent.match(/^(\d+)[\.\)]\s*(.*)/);
            if (numberMatch && isInNotesTerms) {
              const number = numberMatch[1];
              const text = numberMatch[2];
              return (
                <p className="mb-3 text-gray-800 font-normal" {...props}>
                  {number}. {text}
                </p>
              );
            }

            // Subtotal table cells, bold, etc. (no change)
            const hasSubtotalCells = childrenArray.some(
              child => React.isValidElement(child) && child.props?.className === "subtotal-cell"
            );
            if (hasSubtotalCells) {
              let description = '';
              let amount = '';
              childrenArray.forEach(child => {
                if (React.isValidElement(child) && child.props?.className === "subtotal-cell") {
                  const cellChildren = React.Children.toArray(child.props.children);
                  const content = cellChildren.map(item =>
                    typeof item === 'string' ? item : ''
                  ).join('').trim();
                  if (content.includes('$')) {
                    amount = content;
                  } else {
                    description = content;
                  }
                }
              });
              if (description && amount) {
                return <MarkdownTableBlock rows={[[description, amount]]} />;
              }
            }

            // Regular paragraphs (within Notes & Terms as normal text)
            return <p className={isInNotesTerms ? "mb-3 text-gray-800 font-normal" : ""} {...props}>{children}</p>;
          },
          li: ({ children, ...props }) => {
            const isInNotesTerms = currentSection === "notes-terms";
            // In Notes & Terms, render as standard black text paragraphs
            if (isInNotesTerms) {
              const childrenArray = React.Children.toArray(children);
              const textContent = childrenArray.map(child =>
                typeof child === 'string' ? child : ''
              ).join('');
              // Check if it's a numbered item
              const numberMatch = textContent.match(/^(\d+)[\.\)]\s*(.*)/);
              if (numberMatch) {
                const number = numberMatch[1];
                const text = numberMatch[2];
                return (
                  <li className="pl-2 mb-3 text-gray-800 font-normal list-none" {...props}>
                    {number}. {text}
                  </li>
                );
              }
              return (
                <li className="pl-2 mb-3 text-gray-800 font-normal list-none" {...props}>
                  {textContent}
                </li>
              );
            }
            // For other sections: handle numbered items with orange circles
            const childrenArray = React.Children.toArray(children);
            const textContent = childrenArray.map(child =>
              typeof child === 'string' ? child : ''
            ).join('');
            const numberMatch = textContent.match(/^(\d+)[\.\)]\s*(.*)/);
            if (numberMatch) {
              const number = numberMatch[1];
              const text = numberMatch[2];
              return (
                <li className="flex items-start mb-4" {...props}>
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-construction-orange text-white rounded-full mr-2 font-bold text-sm flex-shrink-0">
                    {number}
                  </span>
                  {text}
                </li>
              );
            }
            return <li {...props}>{children}</li>;
          },
          strong: ({ children, ...props }) => {
            const isInNotesTerms = currentSection === "notes-terms";
            // In Notes & Terms, use regular non-colored text for strong elements
            if (isInNotesTerms) {
              return <span className="font-semibold text-gray-800" {...props}>{children}</span>;
            }
            return <strong {...props}>{children}</strong>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
