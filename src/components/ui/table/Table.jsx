// File: /src/components/ui/table/Table.jsx
import React from "react";

export default function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-200 dark:bg-zinc-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${
                rowIndex % 2 === 0
                  ? "bg-gray-100 dark:bg-zinc-800"
                  : "bg-white dark:bg-zinc-900"
              }`}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
                >
                  {typeof row[column.key] === "object" ? (
                    row[column.key].isLink ? (
                      <a
                        href="#"
                        onClick={() => row[column.key].action()}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {row[column.key].label}
                      </a>
                    ) : (
                      row[column.key].label
                    )
                  ) : (
                    row[column.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
