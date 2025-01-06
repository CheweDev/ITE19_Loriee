import React, { useState } from "react";
import Header from "./Header";

const Product = () => {
  // Example data
  const branches = ["Branch A", "Branch B", "Branch C", "Branch D", "Branch E"];
  const categories = ["Electronics", "Clothing", "Groceries"];
  const products = [
    {
      id: 1,
      name: "Laptop",
      branch: "Branch A",
      category: "Electronics",
      price: 999,
      image: "img.jpg",
    },
    {
      id: 2,
      name: "T-Shirt",
      branch: "Branch B",
      category: "Clothing",
      price: 25,
      image: "img.jpg",
    },
    {
      id: 3,
      name: "Apple",
      branch: "Branch C",
      category: "Groceries",
      price: 2,
      image: "img.jpg",
    },
    {
      id: 4,
      name: "Headphones",
      branch: "Branch A",
      category: "Electronics",
      price: 150,
      image: "img.jpg",
    },
  ];

  const userDetails = {
    name: "Marc Dom Gerasmio",
    address: "Villa Paraiso, Ampayon Butuan City",
    phone: "09518149753",
  };

  const handlePlaceOrder = () => {
    alert(
      `Order placed successfully for ${selectedProduct.name}!\n\nShipping to:\nName: ${userDetails.name}\nAddress: ${userDetails.address}\nPhone: ${userDetails.phone}`
    );
    setShowModal(false);
  };

  // State for filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // State for the modal
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Handle branch checkbox change
  const handleBranchChange = (branch) => {
    setSelectedBranches(
      (prev) =>
        prev.includes(branch)
          ? prev.filter((b) => b !== branch) // Remove branch if already selected
          : [...prev, branch] // Add branch if not selected
    );
  };

  // Handle category checkbox change
  const handleCategoryChange = (category) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category) // Remove category if already selected
          : [...prev, category] // Add category if not selected
    );
  };

  // Handle modal open
  const handleCheckoutClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  // Filtered products based on search, branches, and categories
  const filteredProducts = products.filter(
    (product) =>
      (searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true) &&
      (selectedBranches.length > 0
        ? selectedBranches.includes(product.branch)
        : true) &&
      (selectedCategories.length > 0
        ? selectedCategories.includes(product.category)
        : true)
  );

  return (
    <>
      <Header />
      <div className="flex gap-6 p-2 mt-1 items-start">
        {/* Sidebar for Filtering */}
        <div className="w-1/4 bg-teal-500 p-4 rounded-lg shadow sticky top-0 h-screen">
          <h3 className="text-lg font-bold mb-4 text-white">Filter By</h3>

          {/* Search Bar */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2 text-white">Search</h4>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter by Branch */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2 text-white">Branches</h4>
            <div className="space-y-2">
              {branches.map((branch) => (
                <label
                  key={branch}
                  className="flex items-center space-x-2 text-white"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectedBranches.includes(branch)}
                    onChange={() => handleBranchChange(branch)}
                  />
                  <span>{branch}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter by Category */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2 text-white">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-2 text-white"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Product Display */}
        <div className="w-3/4 max-h-screen overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden relative"
              >
                {/* Image with Badge Overlay */}
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <span
                    className={`absolute top-2 left-2 text-xs font-semibold px-3 py-1 rounded-full text-white ${
                      product.branch === "Branch A"
                        ? "bg-green-500"
                        : product.branch === "Branch B"
                        ? "bg-blue-500"
                        : "bg-red-500"
                    }`}
                  >
                    {product.branch}
                  </span>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h5 className="text-lg font-medium mb-1">{product.name}</h5>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.category}
                  </p>
                  <p className="text-lg font-semibold text-gray-800 mb-4">
                    ${product.price}
                  </p>

                  <div className="flex gap-2">
                    {/* Add to Cart Button */}
                    <button className="block w-2/3 px-4 text-center text-teal-600 border border-teal-600 rounded-lg hover:bg-gray-100">
                      + Cart
                    </button>
                    <button
                      onClick={() => handleCheckoutClick(product)}
                      className="block w-full px-4 py-2 text-center text-white bg-teal-600 rounded-lg hover:bg-teal-700"
                    >
                      Check Out
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-gray-500 text-center">
              No products found!
            </p>
          )}
        </div>
      </div>

      {/* Modal for Product Checkout */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-2/3 flex">
            {/* Image Section */}
            <div className="flex-shrink-0 w-2/3 pr-6">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full object-cover rounded-lg"
              />
            </div>

            <div className="w-1/4">
              {/* User Details Section */}
              <div className="mb-4 border-b border-gray-300 pt-4">
                <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
                <p className="text-sm text-gray-700">
                  <strong>Name:</strong> {userDetails.name}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Address:</strong> {userDetails.address}
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  <strong>Phone:</strong> {userDetails.phone}
                </p>
              </div>

              {/* Product Details Section */}
              <h2 className="text-2xl font-semibold mb-2">
                {selectedProduct.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {selectedProduct.category}
              </p>

              {/* Quantity Section */}
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  min="1"
                />
              </div>

              <p className="text-lg font-semibold mb-4">
                Total: ${selectedProduct.price * quantity}
              </p>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                className="w-full px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700"
              >
                Place Order
              </button>

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="mt-2 w-full px-4 py-2 text-teal-600 border border-teal-600 rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
