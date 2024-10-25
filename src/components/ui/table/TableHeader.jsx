// File: /src/components/ui/table/TableHeader.jsx

export default function TableHeader({ columns }) {
  return (
    <thead className="bg-gray-200 text-left">
      <tr>
        {columns.map((col) => (
          <th key={col.key} className="px-4 py-2 whitespace-nowrap">
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
