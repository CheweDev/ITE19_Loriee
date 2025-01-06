import React, { useState, useEffect } from "react";
import Header from "./Header";

const Cart = () => {
  const userDetails = JSON.parse(sessionStorage.getItem("user"));
  const [showModal, setShowModal] = useState(false);
  const [checkedOutItems, setCheckedOutItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch(
        `http://localhost:1337/api/carts?filters[user_name][$eq]=${userDetails.name}&_limit=1000`
      );
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.data);
      } else {
        console.error("Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };



  const handleQuantityChange = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveItem = async (item) => {
    try {
      const response = await fetch(
        `http://localhost:1337/api/carts/${item.documentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
      window.location.reload();
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      setCartItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const selectedCartItems = cartItems.filter((item) => item.selected);

    for (const item of selectedCartItems) {
      const cartData = {
        data: {
          product_name: item.product_name,
          quantity: item.quantity,
          total: item.price * item.quantity,
          customer_name: item?.user_name || "Guest",
          date: formattedDate,
          branch_name: item.branch_name,
        },
      };

      try {
        const response = await fetch("http://localhost:1337/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cartData),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Failed to add item:", errorData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    handleDelete(selectedCartItems);
  };

  const handleDelete = async (items) => {
    for (const item of items) {
      try {
        const response = await fetch(
          `http://localhost:1337/api/carts/${item.documentId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`Failed to delete item with id ${item.id}:`, errorData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    alert("Checkout successful");
    window.location.reload();
  };


  const selectedTotal = cartItems
    .filter((item) => item.selected)
    .reduce((acc, item) => acc + item.price * item.quantity, 0);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      <Header />
      <div className="flex flex-col mx-auto max-w-4xl p-3 space-y-2 sm:p-10 bg-gray-50 text-gray-800 mt-3">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">Your Cart</h2>
        </div>
        {cartItems.length > 0 ? (
          <>
            <ul className="flex flex-col divide-y divide-gray-300">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col py-6 sm:flex-row sm:justify-between"
                >
                  <div className="flex w-full space-x-2 sm:space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleSelectItem(item.id)}
                        className="h-5 w-5 text-teal-600 rounded"
                      />
                    </div>
                    <img
                      className="flex-shrink-0 object-cover w-20 h-20 border-transparent rounded sm:w-32 sm:h-32 bg-gray-500"
                      src={item.image}
                      alt={item.name}
                    />
                    <div className="flex flex-col justify-between w-full pb-4">
                      <div className="flex justify-between w-full pb-2 space-x-2">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold leading-snug sm:pr-8">
                            {item.product_name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            disabled={item.quantity === 1}
                          >
                            -
                          </button>
                          <span className="text-lg font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="flex items-center px-2 py-1 text-red-500 hover:text-red-700 space-x-1"
                          onClick={() => handleRemoveItem(item)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            className="w-4 h-4 fill-current"
                          >
                            <path d="M96,472a23.82,23.82,0,0,0,23.579,24H392.421A23.82,23.82,0,0,0,416,472V152H96Zm32-288H384V464H128Z"></path>
                            <rect
                              width="32"
                              height="200"
                              x="168"
                              y="216"
                            ></rect>
                            <rect
                              width="32"
                              height="200"
                              x="240"
                              y="216"
                            ></rect>
                            <rect
                              width="32"
                              height="200"
                              x="312"
                              y="216"
                            ></rect>
                            <path d="M328,88V40c0-13.458-9.488-24-21.6-24H205.6C193.488,16,184,26.542,184,40V88H64v32H448V88ZM216,48h80V88H216Z"></path>
                          </svg>
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-1 text-right">
              <p>
                Total amount for selected items:
                <span className="font-semibold">
                  {" "}
                  ${selectedTotal.toFixed(2)}
                </span>
              </p>
            </div>

            <div className="space-y-4 text-right">
              <p>
                Total amount for all items in the cart:
                <span className="font-semibold"> ${total.toFixed(2)}</span>
              </p>
            </div>

            <div className="flex justify-end items-center space-x-4">
              <button
                type="button"
                onClick={handleCheckout}
                className="px-6 py-3 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700"
              >
                Continue to Checkout (Selected)
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-500 mb-4">
              Your cart is empty. Start shopping now!
            </p>
            <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* Modal for Checkout */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-10 rounded-md w-11/12 max-w-4xl flex">
            {/* Left Section: Checked-out items */}
            <div className="flex-1 space-y-4 border-r">
              <h3 className="text-xl font-semibold">Checkout Summary</h3>
              <ul className="space-y-4">
                {checkedOutItems.map((item) => (
                  <li key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Section: Shipping details and total */}
            <div className="flex-1 pl-6 space-y-4">
              <h3 className="text-xl font-semibold">Shipping Details</h3>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {userDetails.name}
                </p>
                <p>
                  <strong>Address:</strong> {userDetails.address}
                </p>
                <p>
                  <strong>Phone:</strong> {userDetails.phone}
                </p>
              </div>

              {/* Total Price */}
              <div className="mt-10 text-right">
                <p className="text-lg font-semibold">
                  Total Price: ${selectedTotal.toFixed(2)}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 text-sm font-semibold text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowModal(false)} // Placeholder for place order functionality
                  className="px-6 py-2 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
