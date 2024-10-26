// File: /src/components/ui/table/TableBody.jsx

import Loader from "./Loader";

export default function TableBody({ columns, data, loading }) {
  if (loading) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={columns.length}
            className="text-center py-4 text-gray-900 dark:text-gray-200"
          >
            <Loader /> {/* Display loader while data is being fetched */}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          className={`${
            rowIndex % 2 === 0
              ? "bg-gray-100 dark:bg-zinc-800"
              : "bg-white dark:bg-zinc-900"
          }`}
        >
          {columns.map((col) => (
            <td
              key={col.key}
              className="border border-gray-200 dark:border-gray-700 px-4 py-2 whitespace-nowrap text-gray-900 dark:text-gray-200"
            >
              {typeof row[col.key] === "object" && row[col.key] !== null ? (
                row[col.key].isLink ? (
                  <a
                    href="#"
                    onClick={() => row[col.key].action()}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {row[col.key].label}
                  </a>
                ) : (
                  row[col.key].label
                )
              ) : (
                row[col.key] || "Not Uploaded"
              )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
