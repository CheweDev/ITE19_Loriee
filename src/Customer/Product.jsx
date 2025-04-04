import React, { useState, useEffect } from "react";
import CheckoutModal from "./CheckoutModal";
import Header from "./Header";
import Swal from "sweetalert2";

const Product = () => {
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [notification, setNotification] = useState("");
  const userDetails = JSON.parse(sessionStorage.getItem("user"));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

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
        const categoriesNames = data.data.map((item) => item.category_name);
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
        const branchNames = data.data.map((item) => item.branch_name);
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

  const handleBranchChange = (branch_name) => {
    setSelectedBranches((prev) =>
      prev.includes(branch_name)
        ? prev.filter((b) => b !== branch_name)
        : [...prev, branch_name]
    );
  };

  const handleCategoryChange = (category_name) => {
    setSelectedCategories((prev) =>
      prev.includes(category_name)
        ? prev.filter((c) => c !== category_name)
        : [...prev, category_name]
    );
  };

  const handleCheckoutClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

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
        branch_name: product.branch_name,
        image: product.image,
      },
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
        setNotification("Product added to cart!");
        setTimeout(() => setNotification(""), 3000);
        setShowModal(false);
        Swal.fire({
          title: "Success!",
          text: "Product added to cart.",
          icon: "success",
        });
      } else {
        const errorData = await response.text();
        setNotification("Failed to add to cart!");
        setTimeout(() => setNotification(""), 3000);
        console.error(errorData);
        Swal.fire({
          title: "Error",
          text: "Failed to add the product to the cart.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setNotification("An error occurred while adding to cart!");
      setTimeout(() => setNotification(""), 3000);
      Swal.fire({
        title: "Error",
        text: "An error occurred while adding the product to the cart.",
        icon: "error",
      });
    }
  };

  return (
    <>
      <Header />
      <div className="flex gap-6 items-start bg-gray-100">
        <div className="w-1/4 bg-white p-4 h-screen sticky top-0 overflow-y-auto border-r">
          <h3 className="text-lg tracking-wider font-bold">Filter By</h3>
          <div className="mb-5">
            <h4 className="text-sm font-medium mb-2 text-white">Search</h4>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <h4 className="font-semibold tracking-wider mb-2">Branches:</h4>
            {branches.map((branch) => (
              <label key={branch} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedBranches.includes(branch)}
                  onChange={() => handleBranchChange(branch)}
                />
                <span>{branch}</span>
              </label>
            ))}
          </div>
          <div className="mb-4">
            <h4 className="font-semibold tracking-wider mb-2">Categories:</h4>
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="w-3/4 p-2 max-h-screen overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden relative"
              >
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
                <div className="p-4">
                  <h5 className="text-lg font-medium mb-1">
                    {product.product_name}
                  </h5>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.category_name}
                  </p>
                  <p className="text-lg font-semibold text-gray-800 mb-4">
                    ₱{product.product_price}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="block w-2/3 px-4 text-center text-[#205781] border border-[#205781] rounded-lg hover:bg-gray-100"
                    >
                      + Cart
                    </button>
                    <button
                      onClick={() => handleCheckoutClick(product)}
                      className="block w-full px-4 py-2 text-center text-white bg-[#205781] rounded-lg"
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

      <CheckoutModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedProduct={selectedProduct}
        quantity={quantity}
        handlePlaceOrder={handlePlaceOrder}
      />
    </>
  );
};

export default Product;
