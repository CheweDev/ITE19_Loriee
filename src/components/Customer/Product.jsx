import React, { useState, useEffect } from "react";
import Header from "./Header";

const Product = () => {
  // Example data
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const userDetails = JSON.parse(sessionStorage.getItem("user"));
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:1337/api/products`);
        const data = await response.json();  
        setProducts(data.data || []); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, []);

   useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://localhost:1337/api/categories`);
        const data = await response.json();  
        const categoriesNames = data.data.map(item => item.category_name);
        setCategories(categoriesNames); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(`http://localhost:1337/api/branches`);
        const data = await response.json();  
        const branchNames = data.data.map(item => item.branch_name);
        setBranches(branchNames);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchBranches();
  }, []);



  const handlePlaceOrder = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
      const cartData = {
        data: {
          product_name: selectedProduct.product_name,
          quantity: quantity,
          total: selectedProduct.product_price * quantity,
          customer_name: userDetails.name,
          date: formattedDate,
          branch_name: selectedProduct.branch_name,
        },
      };
  
      const jsonString = JSON.stringify(cartData);
  
      try {
        const response = await fetch("http://localhost:1337/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonString,
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("Item processed:", data);
        } else {
          const errorData = await response.text();
          console.error("Failed to add item:", errorData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    alert("Item Buy Successful!");
    window.location.reload();
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
  const handleBranchChange = (branch_name) => {
    setSelectedBranches(
      (prev) =>
        prev.includes(branch_name)
          ? prev.filter((b) => b !== branch_name) // Remove branch if already selected
          : [...prev, branch_name] // Add branch_name if not selected
    );
  };

  // Handle category checkbox change
  const handleCategoryChange = (category_name) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(category_name)
          ? prev.filter((c) => c !== category_name) // Remove category if already selected
          : [...prev, category_name] // Add category if not selected
    );
  };

  // Handle modal open
  const handleCheckoutClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  // Filtered products based on search, branches, and categories
  const filteredProducts = products.filter(
    (product) =>
      (searchQuery
        ? product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
        : true) &&
      (selectedBranches.length > 0
        ? selectedBranches.includes(product.branch_name)
        : true) &&
      (selectedCategories.length > 0
        ? selectedCategories.includes(product.category_name)
        : true)
  );

  const handleAddToCart = async (product) => {
    const cartData = {
      data: {
        product_name: product.product_name,
        quantity: 1,
        price: product.product_price,
        user_name: userDetails.name, 
        branch_name : product.branch_name,
        image:  product.image,
      }
    };
    const jsonString = JSON.stringify(cartData);
    try {
      const response = await fetch("http://localhost:1337/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: jsonString,
      });

      if (response.ok) {
        const data = await response.json();
        alert("Product added to cart!");
        console.log(data);
        window.location.reload();
      } else {
        const errorData = await response.text(); 
        alert("Failed to add to cart!");
        console.error(errorData);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding to cart!");
    }
  };

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
              {branches.map((branch_name) => (
                <label
                  key={branch_name}
                  className="flex items-center space-x-2 text-white"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectedBranches.includes(branch_name)}
                    onChange={() => handleBranchChange(branch_name)}
                  />
                  <span>{branch_name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter by Category */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2 text-white">Categories</h4>
            <div className="space-y-2">
              {categories.map((category_name) => (
                <label
                  key={category_name}
                  className="flex items-center space-x-2 text-white"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectedCategories.includes(category_name)}
                    onChange={() => handleCategoryChange(category_name)}
                  />
                  <span>{category_name}</span>
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
                      product.branch_name === "Branch A"
                        ? "bg-green-500"
                        : product.branch_name === "Branch B"
                        ? "bg-blue-500"
                        : "bg-red-500"
                    }`}
                  >
                    {product.branch_name}
                  </span>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h5 className="text-lg font-medium mb-1">{product.product_name}</h5>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.category_name}
                  </p>
                  <p className="text-lg font-semibold text-gray-800 mb-4">
                    ${product.product_price}
                  </p>

                  <div className="flex gap-2">
                    {/* Add to Cart Button */}
                    <button 
                     onClick={() => handleAddToCart(product)}
                    className="block w-2/3 px-4 text-center text-teal-600 border border-teal-600 rounded-lg hover:bg-gray-100">
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
                  <strong>Phone:</strong> {userDetails.phoneNumber}
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
                Total: ${selectedProduct.product_price * quantity}
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
