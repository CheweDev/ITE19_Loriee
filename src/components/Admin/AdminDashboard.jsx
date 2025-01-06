import React, { useState } from "react";

const AdminDashboard = () => {
  // Static data for top sales and transactions
  const transactionHistory = [
    {
      date: "2025-01-01",
      branch: "Branch 1",
      product: "Product A",
      quantity: 10,
      total: 1000,
    },
    {
      date: "2025-01-02",
      branch: "Branch 2",
      product: "Product B",
      quantity: 5,
      total: 500,
    },
    {
      date: "2025-01-03",
      branch: "Branch 3",
      product: "Product C",
      quantity: 20,
      total: 2000,
    },
    {
      date: "2025-01-04",
      branch: "Branch 4",
      product: "Product D",
      quantity: 15,
      total: 1500,
    },
    {
      date: "2025-01-05",
      branch: "Branch 5",
      product: "Product E",
      quantity: 8,
      total: 800,
    },
    {
      date: "2025-01-05",
      branch: "Branch 1",
      product: "Product A",
      quantity: 5,
      total: 500,
    },
    {
      date: "2025-01-05",
      branch: "Branch 2",
      product: "Product B",
      quantity: 10,
      total: 1000,
    },
  ];

  // Calculate Top Sales per Branch
  const calculateTopSales = (transactions) => {
    const branchSalesMap = {};

    transactions.forEach((transaction) => {
      const { branch, product, quantity, total } = transaction;

      if (!branchSalesMap[branch]) {
        branchSalesMap[branch] = {
          branch,
          totalSales: 0,
          topProduct: { name: product, quantity: 0 },
        };
      }

      branchSalesMap[branch].totalSales += total;

      if (quantity > branchSalesMap[branch].topProduct.quantity) {
        branchSalesMap[branch].topProduct = { name: product, quantity };
      }
    });

    return Object.values(branchSalesMap);
  };

  const branchSales = calculateTopSales(transactionHistory);

  const [searchBranch, setSearchBranch] = useState("");
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactionHistory);

  // Logout functionality
  const handleLogout = () => {
    // Clear user session or token
    console.log("User logged out");
    // Redirect to login page
    window.location.href = "/";
  };

  // Filter transactions by branch name
  const handleBranchFilter = (branchName) => {
    if (branchName === "") {
      setFilteredTransactions(transactionHistory);
    } else {
      const filtered = transactionHistory.filter(
        (transaction) =>
          transaction.branch.toLowerCase() === branchName.toLowerCase()
      );
      setFilteredTransactions(filtered);
    }
    setSearchBranch(branchName);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-teal-700 text-white py-5 shadow-md">
        <div className="container mx-auto px-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-teal-200">
              Monitor branch performance and transactions
            </p>
          </div>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-white text-teal-700 hover:bg-teal-100 px-4 py-2 rounded-lg font-medium shadow"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-5 py-10">
        {/* Top Sales Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Top Sales Per Branch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branchSales.map((branch, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-teal-700 hover:shadow-2xl transition-shadow"
              >
                <h3 className="text-xl font-bold text-teal-800">
                  {branch.branch}
                </h3>
                <p className="text-gray-600 mt-2">
                  <strong>Total Sales:</strong> ₱
                  {branch.totalSales.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <strong>Top Product:</strong> {branch.topProduct.name} (
                  {branch.topProduct.quantity} sold)
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Transaction History Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Transaction History
          </h2>

          {/* Filter Input */}
          <div className="mb-6">
            <label htmlFor="branch" className="block text-gray-600 font-medium">
              Filter by Branch:
            </label>
            <input
              type="text"
              id="branch"
              value={searchBranch}
              onChange={(e) => handleBranchFilter(e.target.value)}
              placeholder="Enter branch name (e.g., Branch 1)"
              className="input input-bordered border border-gray-300 rounded-lg p-2 w-full md:w-64 mt-2"
            />
          </div>

          {/* Transaction Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="table-auto border-collapse border border-gray-300 w-full text-left">
              <thead className="bg-teal-700 text-white">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Branch</th>
                  <th className="border border-gray-300 px-4 py-2">Product</th>
                  <th className="border border-gray-300 px-4 py-2">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {transaction.branch}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {transaction.product}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {transaction.quantity}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        ₱{transaction.total.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-gray-600 py-4 border border-gray-300"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
