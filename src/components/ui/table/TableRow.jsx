// File: /src/components/ui/table/TableRow.jsx

import TableCell from "./TableCell";

// Table Row Component
const TableRow = ({ row, columns }) => {
  return (
    <tr className="border-b dark:border-zinc-700">
      {columns.map((col) => (
        <TableCell
          key={col.key}
          value={row[col.key]}
          isAction={col.isActionColumn}
        />
      ))}
    </tr>
  );
};

export default TableRow;
