import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [searchBranch, setSearchBranch] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Fetch transaction history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:1337/api/transactions?pagination[pageSize]=1000`
        );
        const data = await response.json();
        const formattedData = data.data.map((item) => ({
          date: item.date,
          branch: item.branch_name,
          product: item.product_name,
          quantity: parseInt(item.quantity),
          total: parseFloat(item.total),
        }));
        setTransactionData(formattedData);
        setFilteredTransactions(formattedData); // Initialize filtered transactions
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchHistory();
  }, []);

  const calculateTopSales = (transactions) => {
    const branchSalesMap = {};
  
    transactions.forEach(({ branch, product, quantity, total }) => {
      if (!branchSalesMap[branch]) {
        branchSalesMap[branch] = {
          branch,
          totalSales: 0,
          productQuantities: {}, // Track quantities for all products.
        };
      }
  
      branchSalesMap[branch].totalSales += total;
  
      if (!branchSalesMap[branch].productQuantities[product]) {
        branchSalesMap[branch].productQuantities[product] = 0;
      }
  
      branchSalesMap[branch].productQuantities[product] += quantity;
    });
  
    return Object.values(branchSalesMap).map(({ branch, totalSales, productQuantities }) => {
      const topProduct = Object.entries(productQuantities).reduce(
        (top, [product, quantity]) => (quantity > top.quantity ? { name: product, quantity } : top),
        { name: null, quantity: 0 }
      );
  
      return { branch, totalSales, topProduct };
    });
  };

  const branchSales = calculateTopSales(transactionData);

  // Filter transactions by branch name
  const handleBranchFilter = (branchName) => {
    if (branchName === "") {
      setFilteredTransactions(transactionData);
    } else {
      const filtered = transactionData.filter(
        (transaction) =>
          transaction.branch.toLowerCase() === branchName.toLowerCase()
      );
      setFilteredTransactions(filtered);
    }
    setSearchBranch(branchName);
  };

  // Logout functionality
  const handleLogout = () => {
    console.log("User logged out");
    window.location.href = "/";
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
                        ₱{transaction.total}
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
