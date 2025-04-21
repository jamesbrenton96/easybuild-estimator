
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkdownTableStyle from "./MarkdownTableStyle";

/**
 * Render markdown content with professional table and content styling.
 * Used inside MarkdownEstimate.
 */
export default function MarkdownContentRenderer({ content }: { content: string }) {

  // Custom renderer for sections
  const renderSectionAsList = (
    children: React.ReactNode[],
    headerTest: (content: string) => boolean
  ): React.ReactNode => {
    const bulletPoints: string[] = [];

    let insideSection = false;
    let headerIndex = -1;

    // Find header line & collect list
    React.Children.forEach(children, (child, idx) => {
      // Safely check if the child is a React element
      if (!React.isValidElement(child)) return;
      
      // Safely access props and check for heading type
      const props = child.props;
      if (!props) return;
      
      // Check if it's a heading element
      const nodeProps = props.node as { type?: string } | undefined;
      if (nodeProps?.type === "heading") {
        // Get the text content from children props if they exist
        const childrenProps = props.children;
        if (Array.isArray(childrenProps) && childrenProps.length > 0) {
          const firstChild = childrenProps[0];
          // Safely access the text value
          if (React.isValidElement(firstChild) && firstChild.props) {
            // Fix: Properly access and check the value property with type safety
            const textValue = firstChild.props?.value;
            if (typeof textValue === 'string' && headerTest(textValue)) {
              insideSection = true;
              headerIndex = idx;
            } else {
              insideSection = false;
            }
          }
        }
      } else if (insideSection) {
        // Only pick paragraphs (be strict, skip tables/lists etc)
        const nodeProps = props.node as { type?: string } | undefined;
        if (nodeProps?.type === "paragraph") {
          // Safe extraction of text content
          const childContent = React.Children.toArray(props.children)
            .map(str => {
              // Fix: Properly type check before using trim
              return typeof str === "string" ? str.trim() : "";
            })
            .filter(Boolean)
            .join(" ");
          
          if (childContent) {
            bulletPoints.push(childContent);
          }
        }
        // If child is string (loose paragraphs)
        else if (typeof child === "string") {
          bulletPoints.push(child.trim());
        }
      }
    });

    if (headerIndex !== -1 && bulletPoints.length > 0) {
      return (
        <>
          {children[headerIndex]}
          <ul className="ml-6 list-disc">
            {bulletPoints.map((item, i) => (
              <li key={i} className="my-1">{item}</li>
            ))}
          </ul>
        </>
      );
    }

    return children;
  };

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
          // Handle custom spans for section numbers, subtotals, etc.
          span: ({ className, children, ...props }) => {
            if (className === "total-project-cost-block") {
              return <div className="total-project-cost-block">{children}</div>;
            }
            if (className === "subtotal-cell") {
              return <strong className="subtotal-cell">{children}</strong>;
            }
            if (className === "section-number") {
              return (
                <span className="inline-flex items-center justify-center w-7 h-7 bg-construction-orange text-white rounded-full mr-2 font-bold text-sm">
                  {children}
                </span>
              );
            }
            return <span {...props}>{children}</span>;
          },
          // Improve table styling
          table: ({ ...props }) => {
            return <table className="estimate-table w-full my-6 border-collapse" {...props} />;
          },
          thead: ({ ...props }) => {
            return <thead className="estimate-table-head bg-construction-orange text-white" {...props} />;
          },
          tbody: ({ ...props }) => {
            return <tbody className="estimate-table-body" {...props} />;
          },
          th: ({ ...props }) => {
            return <th className="estimate-table-header p-3 text-left font-bold" {...props} />;
          },
          td: ({ ...props }) => {
            return <td className="estimate-table-cell p-3 border border-gray-200" {...props} />;
          },
          p: ({ children, ...props }) => {
            // Check if this paragraph contains a section-number span
            const childrenArray = React.Children.toArray(children);
            const hasNumberedSection = childrenArray.some(
              child => React.isValidElement(child) && child.props?.className === "section-number"
            );
            
            // Special handling for paragraphs with subtotal cells
            const hasSubtotalCells = childrenArray.some(
              child => React.isValidElement(child) && child.props?.className === "subtotal-cell"
            );
            
            if (hasNumberedSection) {
              return <p className="flex items-start mb-2" {...props}>{children}</p>;
            }
            
            if (hasSubtotalCells) {
              // Create a proper table row from subtotal cells
              const cells = childrenArray;
              
              // SAFE way to check if the first cell is a <table>
              if (
                cells.length > 0 &&
                React.isValidElement(cells[0]) &&
                (cells[0].type === 'table' ||
                  // Some Markdown parsers may use lowercase/uppercase string
                  (typeof cells[0].type === 'string' && cells[0].type.toLowerCase() === 'table'))
              ) {
                return <>{children}</>;
              }
              
              let description = '';
              let amount = '';
              
              // Extract the content of the subtotal cells
              cells.forEach(cell => {
                if (React.isValidElement(cell) && cell.props?.className === "subtotal-cell") {
                  const cellChildren = React.Children.toArray(cell.props.children);
                  const content = cellChildren.map(item => 
                    typeof item === 'string' ? item : ''
                  ).join('').trim();
                  
                  // Check if this cell contains a dollar sign (likely the amount)
                  if (content.includes('$')) {
                    amount = content;
                  } else {
                    description = content;
                  }
                }
              });
              
              // If we have both description and amount, create a table row
              if (description && amount) {
                return (
                  <table className="subtotal-table border-collapse w-full my-3">
                    <tbody>
                      <tr className="subtotal-row">
                        <td className="estimate-table-cell p-3 border border-gray-200 text-left">{description}</td>
                        <td className="estimate-table-cell p-3 border border-gray-200 text-right">{amount}</td>
                      </tr>
                    </tbody>
                  </table>
                );
              }
            }

            return <p {...props}>{children}</p>;
          },
          // Handle code blocks without inline property
          code: ({ className, children, ...props }) => {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>

      {/* Custom bullet point rendering logic for specific sections */}
      <script dangerouslySetInnerHTML={{ __html: `
        // Correspondence section
        (function() {
          const correspondenceHeadings = document.querySelectorAll('h2, h3');
          correspondenceHeadings.forEach(heading => {
            if(['Correspondence Details', 'Correspondence', 'Client Details'].includes(heading.textContent)) {
              let paragraphs = [];
              let current = heading.nextElementSibling;
              while(current && !['H1','H2','H3'].includes(current.tagName)) {
                if(current.tagName === 'P') {
                  paragraphs.push(current.textContent);
                }
                current = current.nextElementSibling;
              }
              
              if(paragraphs.length > 0) {
                const ul = document.createElement('ul');
                ul.className = 'ml-6 list-disc';
                paragraphs.forEach(p => {
                  const li = document.createElement('li');
                  li.className = 'my-1';
                  li.textContent = p;
                  ul.appendChild(li);
                });
                
                // Replace paragraphs with the bullet list
                current = heading.nextElementSibling;
                while(current && !['H1','H2','H3'].includes(current.tagName)) {
                  const next = current.nextElementSibling;
                  if(current.tagName === 'P') {
                    current.remove();
                  }
                  current = next;
                }
                
                heading.after(ul);
              }
            }
          });
        })();

        // Scope of Work section
        (function() {
          const scopeHeadings = document.querySelectorAll('h2, h3');
          scopeHeadings.forEach(heading => {
            if(['Scope of Work', 'Scope'].includes(heading.textContent)) {
              let paragraphs = [];
              let current = heading.nextElementSibling;
              while(current && !['H1','H2','H3'].includes(current.tagName)) {
                if(current.tagName === 'P') {
                  paragraphs.push(current.textContent);
                }
                current = current.nextElementSibling;
              }
              
              if(paragraphs.length > 0) {
                const ul = document.createElement('ul');
                ul.className = 'ml-6 list-disc';
                paragraphs.forEach(p => {
                  const li = document.createElement('li');
                  li.className = 'my-1';
                  li.textContent = p;
                  ul.appendChild(li);
                });
                
                // Replace paragraphs with the bullet list
                current = heading.nextElementSibling;
                while(current && !['H1','H2','H3'].includes(current.tagName)) {
                  const next = current.nextElementSibling;
                  if(current.tagName === 'P') {
                    current.remove();
                  }
                  current = next;
                }
                
                heading.after(ul);
              }
            }
          });
        })();

        // Notes & Terms section
        (function() {
          const notesHeadings = document.querySelectorAll('h2, h3');
          notesHeadings.forEach(heading => {
            if(['Notes & Terms', 'NOTES & TERMS', 'Notes', 'Terms'].includes(heading.textContent)) {
              let paragraphs = [];
              let current = heading.nextElementSibling;
              while(current && !['H1','H2','H3'].includes(current.tagName)) {
                if(current.tagName === 'P') {
                  paragraphs.push(current.textContent);
                }
                current = current.nextElementSibling;
              }
              
              if(paragraphs.length > 0) {
                const ul = document.createElement('ul');
                ul.className = 'ml-6 list-disc';
                paragraphs.forEach(p => {
                  const li = document.createElement('li');
                  li.className = 'my-1';
                  li.textContent = p;
                  ul.appendChild(li);
                });
                
                // Replace paragraphs with the bullet list
                current = heading.nextElementSibling;
                while(current && !['H1','H2','H3'].includes(current.tagName)) {
                  const next = current.nextElementSibling;
                  if(current.tagName === 'P') {
                    current.remove();
                  }
                  current = next;
                }
                
                heading.after(ul);
              }
            }
          });
        })();
      `}} />
    </div>
  );
}
