// File: /src/components/ui/table/TableBody.jsx

import Loader from "./Loader";

export default function TableBody({ columns, data, loading }) {
  if (loading) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length} className="text-center py-4">
            <Loader /> {/* Display loader while data is being fetched */}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((col) => (
            <td key={col.key} className="border px-4 py-2 whitespace-nowrap">
              {typeof row[col.key] === "object" && row[col.key] !== null
                ? row[col.key].label // Display clickable label if it's an object
                : row[col.key] || "Not Uploaded"}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
