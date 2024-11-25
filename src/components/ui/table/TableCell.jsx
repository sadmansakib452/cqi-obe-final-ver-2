// File: /src/components/ui/table/TableCell.jsx

// Table Cell Component
export default function TableCell({ value, isAction }) {
  return (
    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
      {isAction ? (
        <a href="#" className="text-blue-600 dark:text-blue-400">
          {value}
        </a>
      ) : (
        value || "Not uploaded"
      )}
    </td>
  );
}


