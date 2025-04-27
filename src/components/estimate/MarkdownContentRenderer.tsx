
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkdownTableStyle from "./MarkdownTableStyle";
import { CustomSpan } from "./markdown/MarkdownCustomSpans";
import MarkdownSectionBulletList from "./markdown/MarkdownSectionBulletList";
import { MarkdownTableBlock } from "./markdown/MarkdownTableBlock";

/**
 * Render markdown content with professional table and content styling.
 * This version uses the Brenton Building template formatting.
 */
export default function MarkdownContentRenderer({ content }: { content: string }) {
  // Track section we are in
  let currentSection = null;
  
  // Format section number from section title
  const getSectionNumber = (title: string): string | null => {
    const match = title.match(/SECTION\s+(\d+):/i);
    return match ? match[1] : null;
  };
  
  // Get section title without the section number
  const getSectionTitle = (title: string): string => {
    const match = title.match(/SECTION\s+\d+:\s+(.*)/i);
    return match ? match[1].trim() : title.trim();
  };

  return (
    <div className="p-8 markdown-content text-gray-800">
      <MarkdownTableStyle />
      <ReactMarkdown
        className="prose max-w-none"
        remarkPlugins={[remarkGfm]}
        components={{
          span: CustomSpan,
          table: ({ ...props }) => (
            <table className="estimate-table w-full my-4 border-collapse" {...props} />
          ),
          thead: ({ ...props }) => (
            <thead className="estimate-table-head bg-gray-100" {...props} />
          ),
          tbody: ({ ...props }) => (
            <tbody className="estimate-table-body" {...props} />
          ),
          th: ({ ...props }) => (
            <th className="estimate-table-header p-2 text-left font-bold border border-gray-200" {...props} />
          ),
          td: ({ ...props }) => (
            <td className="estimate-table-cell p-2 border border-gray-200" {...props} />
          ),
          h1: ({ children, ...props }) => {
            // Main project type title formatting
            return (
              <div className="project-title-wrapper text-center mb-6 mt-4">
                <h1 className="project-title text-2xl text-construction-orange font-bold">
                  {children}
                </h1>
              </div>
            );
          },
          h2: ({ node, children, ...props }) => {
            const childrenText = React.Children.toArray(children)
              .map(child => (typeof child === 'string' ? child : ''))
              .join('');
              
            const sectionNumber = getSectionNumber(childrenText);
            const sectionTitle = getSectionTitle(childrenText);
            
            // Update current section tracking
            currentSection = sectionTitle.toUpperCase();
            
            return (
              <div className="section-header-container mt-8 mb-4">
                <h2 className="section-header flex items-baseline">
                  {sectionNumber && (
                    <span className="section-number bg-construction-orange text-white rounded-full w-7 h-7 flex items-center justify-center mr-3 text-sm font-bold">
                      {sectionNumber}
                    </span>
                  )}
                  <span>{sectionTitle}</span>
                </h2>
              </div>
            );
          },
          p: ({ children, ...props }) => {
            // Handle special formatting for correspondence section
            if (currentSection === "CORRESPONDENCE") {
              const textContent = React.Children.toArray(children)
                .map(child => (typeof child === 'string' ? child : ''))
                .join('');
              
              if (textContent.startsWith('-')) {
                return (
                  <div className="correspondence-item flex items-baseline mb-2" {...props}>
                    <span className="bullet-marker mr-2">•</span>
                    <span>{textContent.substring(1).trim()}</span>
                  </div>
                );
              }
            }
            
            return (
              <p className="mb-3" {...props}>
                {children}
              </p>
            );
          },
          li: ({ children, ...props }) => {
            // Special formatting for scope of work bullet points
            if (currentSection === "SCOPE OF WORKS") {
              return (
                <div className="scope-bullet mb-2">
                  <span className="bullet-marker">•</span>
                  <span>{children}</span>
                </div>
              );
            }
            
            // Standard list item
            return (
              <li className="mb-2 flex items-start" {...props}>
                <span className="text-construction-orange mr-2">•</span>
                <span>{children}</span>
              </li>
            );
          },
          ul: ({ children, ...props }) => {
            return (
              <ul className="list-none pl-0 mb-4 space-y-2" {...props}>
                {children}
              </ul>
            );
          },
          ol: ({ children, ...props }) => {
            return (
              <ol className="list-none pl-0 mb-4 space-y-2" {...props}>
                {children}
              </ol>
            );
          },
          strong: ({ children, ...props }) => {
            // Highlight important text
            if (currentSection === "TOTAL SUMMARY OF COSTS") {
              const text = React.Children.toArray(children).join('');
              if (text.includes("TOTAL PROJECT COST")) {
                return <span className="font-bold text-construction-orange" {...props}>{children}</span>;
              }
            }
            return <strong className="font-semibold" {...props}>{children}</strong>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
      
      {/* Add document footer */}
      <div className="document-footer text-center text-xs text-gray-500 mt-12 pt-4 border-t border-gray-200">
        <p>Brenton Building | Phone: 021 XXX XXXX | Email: info@brentonbuilding.co.nz</p>
        <p>Quote prepared on {new Date().toLocaleDateString('en-NZ', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })} | Quote Reference: BB-{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}{String(new Date().getDate()).padStart(2, '0')}</p>
      </div>
    </div>
  );
}
