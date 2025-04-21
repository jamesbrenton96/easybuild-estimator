
import React from "react";

/**
 * Simple table block
 */
export function MarkdownTableBlock({ rows }: { rows: Array<[string, string]> }) {
  if (!rows?.length) return null;
  return (
    <table className="subtotal-table border-collapse w-full my-3">
      <tbody>
        {rows.map(([desc, amount], i) => (
          <tr className="subtotal-row" key={i}>
            <td className="estimate-table-cell p-3 border border-gray-200 text-left">{desc}</td>
            <td className="estimate-table-cell p-3 border border-gray-200 text-right">{amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
