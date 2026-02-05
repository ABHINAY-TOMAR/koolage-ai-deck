import React, { useState, useMemo } from 'react';
import { DataGrid, Column } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SheetData {
  [key: string]: string | number;
}

interface SheetTabProps {
  tabId: string;
  initialRows?: SheetData[];
  onSave?: (rows: SheetData[]) => void;
}

export function SheetTab({ tabId, initialRows = [], onSave }: SheetTabProps) {
  const [rows, setRows] = useState<SheetData[]>(
    initialRows.length > 0
      ? initialRows
      : [
          { id: 1, col1: 'Data 1', col2: 'Data 2' },
          { id: 2, col1: 'Data 3', col2: 'Data 4' },
        ]
  );

  const [columnCount, setColumnCount] = useState(
    initialRows.length > 0
      ? Object.keys(initialRows[0] || {}).length
      : 3
  );

  // Dynamically generate columns based on data
  const columns: Column<SheetData>[] = useMemo(() => {
    if (rows.length === 0) return [];
    return Object.keys(rows[0]).map((key) => ({
      key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      sortable: true,
      resizable: true,
      width: 120,
    }));
  }, [rows]);

  const handleRowsChange = (updatedRows: SheetData[]) => {
    setRows(updatedRows);
    onSave?.(updatedRows);
  };

  const addRow = () => {
    const newRow: SheetData = {};
    columns.forEach((col) => {
      newRow[col.key] = '';
    });
    const updated = [...rows, { ...newRow, id: rows.length + 1 }];
    setRows(updated);
    onSave?.(updated);
  };

  const addColumn = () => {
    const newColKey = `col${columnCount + 1}`;
    const updated = rows.map((row) => ({
      ...row,
      [newColKey]: '',
    }));
    setRows(updated);
    setColumnCount(columnCount + 1);
    onSave?.(updated);
  };

  const generateFormula = () => {
    // Placeholder for AI integration
    alert('AI Formula generation coming in Phase 3');
  };

  return (
    <div className="h-full flex flex-col bg-paper">
      {/* Toolbar */}
      <div className="border-b border-border bg-paper-elevated px-4 py-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={addRow}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Row
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={addColumn}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Column
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={generateFormula}
          className="gap-2 bg-spark hover:bg-spark/90 text-accent-foreground"
        >
          <Sparkles className="h-4 w-4" />
          AI Formula
        </Button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-hidden">
        <DataGrid
          columns={columns}
          rows={rows}
          onRowsChange={handleRowsChange}
          className="sheet-grid"
          style={{
            height: '100%',
            fontSize: '13px',
            '--rdg-cell-padding': '8px',
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
