
interface TableRow {
  [key: string]: string | number;
}

interface TableConfig {
  headers: string[];
  rows: TableRow[];
  alignments?: Array<'left' | 'right' | 'center'>;
}

export function createTable({ headers, rows, alignments = [] }: TableConfig): string {
  if (!headers.length || !rows.length) return '';

  const alignmentRow = headers.map((_, index) => {
    const alignment = alignments[index] || 'left';
    switch (alignment) {
      case 'right': return '---:';
      case 'center': return ':---:';
      default: return '---';
    }
  });

  const headerRow = `| ${headers.join(' | ')} |`;
  const alignRow = `| ${alignmentRow.join(' | ')} |`;
  const dataRows = rows.map(row => 
    `| ${headers.map(header => row[header] || '').join(' | ')} |`
  );

  return [headerRow, alignRow, ...dataRows].join('\n');
}
