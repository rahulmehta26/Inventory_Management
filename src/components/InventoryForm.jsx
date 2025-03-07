import React, { useState, useEffect } from "react";
import { CATEGORIES } from "../constants/categories";
import { Plus, Save } from "lucide-react";

export const InventoryForm = ({ onSubmit, editingItem }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: CATEGORIES[1],
    quantity: 0,
    price: 0,
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        category: editingItem.category,
        quantity: editingItem.quantity,
        price: editingItem.price,
      });
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
    });
    // Clear the form fields after submission
    setFormData({ name: "", category: CATEGORIES[1], quantity: 0, price: 0 });
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === "quantity" || field === "price") {
      // Allow empty string during editing and convert to number otherwise
      setFormData({
        ...formData,
        [field]: value === "" ? "" : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const inputClasses =
    "block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm px-3 py-1.5";
  const labelClasses =
    "block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1 ml-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className={labelClasses}>Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleInputChange(e, "name")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Category</label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange(e, "category")}
            className={inputClasses}
          >
            {CATEGORIES.slice(1).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>Quantity</label>
          <input
            type="number"
            placeholder="0"
            required
            min="0"
            value={formData.quantity === 0 ? "" : formData.quantity}
            onChange={(e) => handleInputChange(e, "quantity")}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Price (₹)</label>
          <input
            type="number"
            placeholder="0"
            required
            min="0"
            step="0.01"
            value={formData.price === 0 ? "" : formData.price}
            onChange={(e) => handleInputChange(e, "price")}
            className={inputClasses}
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center px-4 py-1.5 text-sm bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-md hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
        >
          {editingItem ? (
            <>
              <Save size={16} className="mr-2" />
              Update Item
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2" />
              Add Item
            </>
          )}
        </button>
      </div>
    </form>
  );
};
