import React, { useState, useEffect } from "react";
import Header from "./Header";

const Cart = () => {
  const userDetails = JSON.parse(sessionStorage.getItem("user"));
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [checkedOutItems, setCheckedOutItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bankProvider, setBankProvider] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [gcashNumber, setGcashNumber] = useState('');

  const banks = ['Unionbank', 'Security Bank', 'Landbank', 'BPI', 'China Bank', 'EastWest', 'BDO', 'Metrobank'];

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
        setCartItems(data.data.map(item => ({ ...item, selected: false }))); // Initialize selected as false
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

  const handleSelectItem = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleCheckoutClick = () => {
    const hasSelectedItems = cartItems.some(item => item.selected);
    if (!hasSelectedItems) {
      alert("Please select at least one item to checkout");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const selectedCartItems = cartItems.filter((item) => item.selected);
    if (selectedCartItems.length === 0) {
      alert("Please select at least one item to checkout");
      return;
    }

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    for (const item of selectedCartItems) {
      const cartData = {
        data: {
          product_name: item.product_name,
          quantity: item.quantity,
          total: item.price * item.quantity,
          customer_name: item?.user_name || "Guest",
          date: formattedDate,
          branch_name: item.branch_name,
          bank_provider: paymentMethod === 'card' ? bankProvider : 'GCash',
          card_number: paymentMethod === 'card' ? cardNumber : gcashNumber,
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
          return;
        }
      } catch (error) {
        console.error("Error:", error);
        return;
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
    setShowPaymentModal(false);
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
          <h2 className="text-2xl font-bold">Cart</h2>
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
                        checked={item.selected || false}
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
                            ₱{item.price.toFixed(2)}
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
                            <rect width="32" height="200" x="168" y="216"></rect>
                            <rect width="32" height="200" x="240" y="216"></rect>
                            <rect width="32" height="200" x="312" y="216"></rect>
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
                  ₱{selectedTotal.toFixed(2)}
                </span>
              </p>
            </div>

            <div className="space-y-4 text-right">
              <p>
                Total amount for all items in the cart:
                <span className="font-semibold"> ₱{total.toFixed(2)}</span>
              </p>
            </div>

            <div className="flex justify-end items-center space-x-4">
              <button
                type="button"
                onClick={handleCheckoutClick}
                className="px-6 py-3 text-sm font-semibold text-white bg-green-800 rounded-md hover:bg-gray-900"
              >
                Continue to Checkout (Selected)
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-500 mb-4">
              Your cart is empty. Start adding now!
            </p>
            <button className="px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-gray-900">
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-teal-600 p-8 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    Card
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="gcash"
                      checked={paymentMethod === 'gcash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    GCash
                  </label>
                </div>
              </div>

              {paymentMethod === 'card' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Provider
                    </label>
                    <select
                      value={bankProvider}
                      onChange={(e) => setBankProvider(e.target.value)}
                      required
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Bank</option>
                      {banks.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter card number"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GCash Number
                  </label>
                  <input
                    type="text"
                    value={gcashNumber}
                    onChange={(e) => setGcashNumber(e.target.value)}
                    required
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter GCash number"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-800 rounded-md hover:bg-green-900"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;