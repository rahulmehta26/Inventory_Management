import React, { useState, useCallback, useEffect } from "react";
import { InventoryTable } from "./components/InventoryTable";
import { InventoryForm } from "./components/InventoryForm";
import { CATEGORIES } from "./constants/categories";
import { generateSeedData } from "./utils/seedData";
import { Package } from "lucide-react";

export default function App() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const storedItems = localStorage.getItem("inventoryItems");
    setItems(storedItems ? JSON.parse(storedItems) : generateSeedData());
  }, []);


  useEffect(() => {
    localStorage.setItem("inventoryItems", JSON.stringify(items));
  }, [items]);

  const handleAddItem = useCallback(
    (newItem) => {
      if (editingItem) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? { ...item, ...newItem, lastUpdated: new Date() }
              : item
          )
        );
        setEditingItem(null);
      } else {
        setItems((prev) => [
          ...prev,
          {
            ...newItem,
            id: Math.random().toString(36).substr(2, 9),
            lastUpdated: new Date(),
          },
        ]);
      }
    },
    [editingItem]
  );

  const handleEditItem = useCallback((item) => {
    setEditingItem(item);
  }, []);

  const handleDeleteItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleSort = useCallback(
    (field) => {
      setSortDirection((prev) =>
        sortField === field ? (prev === "asc" ? "desc" : "asc") : "asc"
      );
      setSortField(field);
    },
    [sortField]
  );

  const filteredItems = items.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Package
            size={28}
            className="text-purple-600 dark:text-purple-400 mr-3"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Inventory Management
          </h1>
        </div>

        <div className="space-y-4">
          <InventoryForm onSubmit={handleAddItem} editingItem={editingItem} />

          <div className="flex justify-between items-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <InventoryTable
              items={filteredItems}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </div>
        </div>
      </div>
    </div>
  );
}