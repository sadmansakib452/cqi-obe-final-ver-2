// File: /src/components/ui/table/Table.jsx
import React from "react";

export default function Table({ columns, data }) {

    console.log(data)
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {typeof row[column.key] === "object" ? (
                    row[column.key].isLink ? (
                      <a
                        href="#"
                        onClick={() => row[column.key].action()}
                        className="text-blue-600 hover:underline"
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
