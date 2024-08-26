import React from "react";

const DataTable = ({ data, columns, onEdit }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Function to convert column names to a proper form
  const formatColumnName = (columnName) => {
    if (columnName.toLowerCase() === "id") {
      return columnName.toUpperCase(); // Special case for "ID"
    }
    return columnName
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  };

  // Function to convert UTC date string to local timezone string
  const formatDateInLocalTimezone = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-GB", { timeZone: "Asia/Manila" });
  };

  return (
    <div className="bg-white px-4 pb-4 rounded-xl border-gray-200 flex-1">
      <div className="mt-3">
        <table className="w-full text-gray-700 border-x border-gray-200 rounded-xl">
          <thead>
            <tr>
              {columns.map((column) => (
                <th className="text-center" key={column.key}>
                  {column.header || formatColumnName(column.key)}
                </th>
              ))}
              {/* New column for the "Edit" button */}
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td className="text-center" key={column.key}>
                    {column.render
                      ? column.render(item[column.key])
                      : column.key === "stock_in_date"
                      ? formatDateInLocalTimezone(item[column.key])
                      : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
