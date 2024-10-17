import React, { useRef, useEffect, useCallback } from "react";
import { MdDelete, MdAddBox } from "react-icons/md";
import ReactDOM from "react-dom";
import {
  validateDropdown,
  validateQuantity,
  validateReason,
} from "../../../lib/consts/utils/validationUtils";

const StockOutTable = ({
  columns,
  productVariations,
  inventories,
  stockOutProducts,
  setStockOutProducts,
  resetRows,
  setRows,
  rows,
}) => {
  const inputRefs = useRef([]);
  const dropdownRefs = useRef([]);

  // Memoized handleClickOutside function
  const handleClickOutside = useCallback(
    (event) => {
      const isClickInsideDropdown = dropdownRefs.current.some(
        (ref) => ref && ref.contains(event.target),
      );
      const isClickInsideInput = inputRefs.current.some(
        (ref) => ref && ref.contains(event.target),
      );
      if (!isClickInsideDropdown && !isClickInsideInput) {
        setRows((prevRows) =>
          prevRows.map((row) => ({ ...row, isDropdownVisible: false })),
        );
      }
    },
    [setRows],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleAddRow = () => {
    const newRow = {
      variation_id: "",
      product_name: "",
      sku: "",
      type: "",
      value: "",
      quantity: 1,
      reason: "",
      searchTerm: "",
      isDropdownVisible: false,
      errors: { variation: false, quantity: false, reason: false },
    };
    setRows([...rows, newRow]);
    setStockOutProducts([...stockOutProducts, newRow]);
  };

  const handleDeleteRow = (index) => {
    if (rows.length > 1) {
      const updatedRows = rows.filter((_, i) => i !== index);
      setRows(updatedRows);
      setStockOutProducts(updatedRows);
    } else {
      resetRows(); // Reset rows when there's only one row left to delete
    }
  };

  const handleVariationChange = (index, variation) => {
    const updatedRows = [...rows];
    const errors = { ...updatedRows[index].errors };
    errors.variation = !validateDropdown(variation.variation_id);

    updatedRows[index] = {
      ...updatedRows[index],
      variation_id: variation.variation_id,
      product_name: `${variation.product_name} - ${variation.type}: ${variation.value}`,
      sku: variation.sku,
      type: variation.type,
      value: variation.value,
      searchTerm: variation.product_name,
      isDropdownVisible: false,
      errors,
    };

    setRows(updatedRows);
    setStockOutProducts(updatedRows);
  };

  const handleSearchChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].searchTerm = value;
    updatedRows[index].isDropdownVisible = true;
    setRows(updatedRows);
    updateDropdownPosition(index);
  };

  const handleQuantityChange = (index, value) => {
    const updatedRows = [...rows];
    const inventory = inventories.find(
      (inv) => inv.variation_id === updatedRows[index].variation_id,
    );
    const errors = { ...updatedRows[index].errors };
    errors.quantity = !validateQuantity(value, inventory?.stock_quantity || 0);

    updatedRows[index].quantity = value || "";

    updatedRows[index].errors = errors;
    setRows(updatedRows);
    setStockOutProducts(updatedRows);
  };

  const handleQuantityBlur = (index) => {
    const updatedRows = [...rows];
    if (updatedRows[index].quantity === "") {
      updatedRows[index].quantity = 1;
    }
    setRows(updatedRows);
    setStockOutProducts(updatedRows);
  };

  const handleReasonChange = (index, reason) => {
    const updatedRows = [...rows];
    const errors = { ...updatedRows[index].errors };
    errors.reason = !validateReason(reason);
    updatedRows[index].reason = reason;
    updatedRows[index].errors = errors;

    setRows(updatedRows);
    setStockOutProducts(updatedRows);
  };

  const clearSearch = (index) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      variation_id: "",
      product_name: "",
      sku: "",
      type: "",
      value: "",
      searchTerm: "",
      quantity: 1,
      reason: "",
      isDropdownVisible: false,
      errors: { ...updatedRows[index].errors, variation: true },
    };
    setRows(updatedRows);
    setStockOutProducts(updatedRows);
  };

  const updateDropdownPosition = (index) => {
    const inputElement = inputRefs.current[index];
    if (inputElement) {
      const rect = inputElement.getBoundingClientRect();
      const position = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      };
      dropdownRefs.current[index] = position;
    }
  };

  const getFilteredVariations = (searchTerm) =>
    productVariations.filter(
      (variation) =>
        variation.product_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        variation.value?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  return (
    <div className="overflow-x-auto pt-4">
      <div className="flex justify-end pr-6">
        <MdAddBox
          fontSize={30}
          className="text-gray-400 mb-2 hover:text-green-500 active:text-green-600 cursor-pointer"
          onClick={handleAddRow}
        />
      </div>
      <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-pink-500 text-gray-100 text-left text-md font-semibold uppercase tracking-wider">
                #
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-5 py-3 border-b-2 border-gray-200 bg-pink-500 text-gray-100 text-left text-md font-semibold uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-pink-500 text-gray-100 text-center text-md font-semibold uppercase tracking-wider">
                Delete
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {index + 1}
                </td>
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left relative">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search Product Variation"
                      value={row.searchTerm}
                      onChange={(e) =>
                        handleSearchChange(index, e.target.value)
                      }
                      onFocus={() => handleSearchChange(index, row.searchTerm)}
                      className={`w-full border rounded-md px-2 py-1 ${
                        row.errors.variation
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      ref={(el) => (inputRefs.current[index] = el)}
                    />
                    {row.searchTerm && (
                      <button
                        onClick={() => clearSearch(index)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-500"
                        aria-label="Clear search"
                      >
                        &times;
                      </button>
                    )}
                    {row.errors.variation && (
                      <p className="text-red-500 text-xs">
                        Please select a product
                      </p>
                    )}
                  </div>
                  {row.isDropdownVisible &&
                    dropdownRefs.current[index] &&
                    ReactDOM.createPortal(
                      <div
                        ref={(el) => (dropdownRefs.current[index] = el)}
                        className="bg-white border border-slate-300 rounded-md z-20 max-h-40 overflow-y-auto"
                        style={{
                          position: "absolute",
                          top: `${dropdownRefs.current[index].top}px`,
                          left: `${dropdownRefs.current[index].left}px`,
                          width: `${dropdownRefs.current[index].width}px`,
                        }}
                      >
                        {getFilteredVariations(row.searchTerm).length > 0 ? (
                          getFilteredVariations(row.searchTerm).map(
                            (variation) => (
                              <div
                                key={variation.variation_id}
                                onClick={() =>
                                  handleVariationChange(index, variation)
                                }
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {`${variation.product_name} - ${variation.type}: ${variation.value}`}
                              </div>
                            ),
                          )
                        ) : (
                          <div className="px-4 py-2 text-gray-500">
                            No products found
                          </div>
                        )}
                      </div>,
                      document.body,
                    )}
                </td>

                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {row.type && row.value ? `${row.type}: ${row.value}` : "N/A"}
                </td>

                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {row.sku || ""}
                </td>

                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  {inventories.find(
                    (inventory) => inventory.variation_id === row.variation_id,
                  )?.stock_quantity || 0}
                </td>

                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  <input
                    type="number"
                    min="1"
                    value={row.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value)
                    }
                    onBlur={() => handleQuantityBlur(index)}
                    className={`w-20 border ${
                      row.errors.quantity ? "border-red-500" : "border-gray-200"
                    } rounded px-2 py-1`}
                  />
                  {row.errors.quantity && (
                    <p className="text-red-500 text-xs">
                      Quantity must be less than current stock
                    </p>
                  )}
                </td>

                <td className="px-5 py-2 border-b border-gray-200 text-sm text-left">
                  <input
                    type="text"
                    value={row.reason || ""}
                    onChange={(e) => handleReasonChange(index, e.target.value)}
                    className={`w-full border ${
                      row.errors.reason ? "border-red-500" : "border-gray-200"
                    } rounded px-2 py-1`}
                  />
                  {row.errors.reason && (
                    <p className="text-red-500 text-xs">Reason is required</p>
                  )}
                </td>

                <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteRow(index)}
                  >
                    <MdDelete fontSize={30} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockOutTable;
