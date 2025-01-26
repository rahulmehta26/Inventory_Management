import React, { useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import { LOW_STOCK_THRESHOLD } from "../constants/categories";

export const InventoryTable = ({
  items,
  onEdit,
  onDelete,
  sortField,
  sortDirection,
  onSort,
}) => {
  const sortableFields = ["quantity", "price", "lastUpdated"];

  const sortedItems = useMemo(() => {
    if (!sortableFields.includes(sortField)) return items; // Return unsorted items if the field is not sortable

    return [...items].sort((a, b) => {
      const modifier = sortDirection === "asc" ? 1 : -1;
      if (sortField === "quantity" || sortField === "price") {
        return (a[sortField] - b[sortField]) * modifier;
      }
      if (sortField === "lastUpdated") {
        return (
          new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime()
        ) * modifier;
      }
      return 0;
    });
  }, [items, sortField, sortDirection]);

  const SortHeader = ({ field, children }) => (
    <th
      className="px-4 py-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/50"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown
          size={16}
          className={sortField === field ? "opacity-100" : "opacity-30"}
        />
      </div>
    </th>
  );

  return (
    <table className="w-full text-sm">
      <thead className="bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100">
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2 text-center">Category</th>
          <SortHeader field="quantity">Quantity</SortHeader>
          <SortHeader field="price">Price</SortHeader>
          <SortHeader field="lastUpdated">Last Updated</SortHeader>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedItems.map((item) => (
          <tr
            key={item.id}
            className={`border-b border-purple-100 items-center dark:border-purple-800 ${
              item.quantity < LOW_STOCK_THRESHOLD
                ? "bg-red-50 dark:bg-red-900/20"
                : "hover:bg-purple-50 dark:hover:bg-purple-900/20"
            }`}
          >
            <td className="px-4 py-2">{item.name}</td>
            <td className="px-4 py-2 text-center">{item.category}</td>
            <td className="px-4 py-2">
              <span
                className={`${
                  item.quantity < LOW_STOCK_THRESHOLD
                    ? "text-red-600 dark:text-red-400 font-semibold"
                    : ""
                }`}
              >
                {item.quantity}
              </span>
            </td>
            <td className="px-4 py-2">₹ {item.price.toFixed(2)}</td>
            <td className="px-4 py-2">
              {new Date(item.lastUpdated).toLocaleDateString()}
            </td>
            <td className="px-4 py-2">
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-1 cursor-pointer text-sm bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="px-3 py-1 cursor-pointer text-sm bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
