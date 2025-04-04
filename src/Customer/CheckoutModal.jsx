import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const CheckoutModal = ({
  showModal,
  setShowModal,
  selectedProduct,
  quantity,
  handlePlaceOrder,
}) => {
  if (!showModal || !selectedProduct) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-lg relative flex">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          ✖
        </button>
        <div className="w-1/2 pr-6">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.product_name}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="w-1/2 flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {selectedProduct.product_name}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Category:</strong> {selectedProduct.category_name}
          </p>
          <p className="text-lg font-bold text-gray-900 mb-4">
            Total:{" "}
            <span className="text-[#205781]">
              ₱{selectedProduct.product_price * quantity}
            </span>
          </p>
          <PayPalScriptProvider
            options={{
              "client-id":
                "AZTi3ltblgQrvKnwgWx8ERotdC0p6SlkefUZoCXm98tZQ5thMy6hfJ2hNirFY-vFHV1uMWhGxSj7XjpD",
            }}
          >
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: (
                          selectedProduct.product_price * quantity
                        ).toFixed(2),
                      },
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                try {
                  const order = await actions.order.capture();
                  console.log("Payment Successful:", order);
                  handlePlaceOrder();
                  setShowModal(false);
                  Swal.fire(
                    "Success!",
                    "Your payment was successful!",
                    "success"
                  );
                } catch (error) {
                  console.error("Payment error:", error);
                  Swal.fire(
                    "Error",
                    "Something went wrong with PayPal.",
                    "error"
                  );
                }
              }}
              onError={(err) => {
                console.error("PayPal error:", err);
                Swal.fire(
                  "Error",
                  "Something went wrong with PayPal.",
                  "error"
                );
              }}
            />
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
