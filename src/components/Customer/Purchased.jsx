import React, { useState } from "react";
import Header from "./Header.jsx";

const Purchased = () => {
  // Static transaction data
  const staticTransactions = [
    {
      id: 1,
      date: "2025-01-05",
      product_name: "T-shirt",
      quantity: 2,
      total: 40.0,
    },
    {
      id: 2,
      date: "2024-12-20",
      product_name: "Laptop",
      quantity: 1,
      total: 800.0,
    },
    {
      id: 3,
      date: "2024-11-15",
      product_name: "Headphones",
      quantity: 1,
      total: 50.0,
    },
    {
      id: 4,
      date: "2025-01-10",
      product_name: "Jacket",
      quantity: 1,
      total: 60.0,
    },
    {
      id: 5,
      date: "2025-01-10",
      product_name: "Gloves",
      quantity: 2,
      total: 40.0,
    },
  ];

  const [transactionData, setTransactionData] = useState(staticTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter transactions by search query, date range, and sort order
  const filteredTransactions = transactionData.filter((transaction) => {
    const transactionDate = new Date(transaction.date);

    // Check if the transaction matches the product search query
    const matchesSearch = transaction.product_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Check if the transaction date is within the selected range
    const withinStartDate = startDate
      ? transactionDate >= new Date(startDate)
      : true;
    const withinEndDate = endDate ? transactionDate <= new Date(endDate) : true;

    return matchesSearch && withinStartDate && withinEndDate;
  });

  // Sort transactions by date
  const handleSort = () => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setTransactionData(sorted);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-5">
        {/* Filters */}
        <div className="flex justify-between gap-4 mb-4 mt-5">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name..."
              className="input input-bordered w-64 border border-gray-300 rounded-lg p-2"
            />
            <div className="flex gap-2 items-center">
              <label htmlFor="startDate" className="text-sm font-medium">
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input input-bordered border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="flex gap-2 items-center">
              <label htmlFor="endDate" className="text-sm font-medium">
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input input-bordered border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>
          <div>
            <button
              className="btn btn-sm btn-outline px-4 py-2 border rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
              onClick={handleSort}
            >
              Sort by Date {sortOrder === "asc" ? "▲" : "▼"}
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Product Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.product_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      ₱{transaction.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center mt-10">
            <p className="text-lg font-medium text-gray-600">
              No transactions found.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Purchased;
