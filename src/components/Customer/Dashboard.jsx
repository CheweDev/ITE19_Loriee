import Header from "./Header.jsx";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:1337/api/products`);
        const data = await response.json();

        // Shuffle the data and pick 8 random rows
        const shuffledProducts = (data.data || []).sort(
          () => 0.5 - Math.random()
        );
        const randomProducts = shuffledProducts.slice(0, 8);

        setProducts(randomProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  return (
    <>
      <Header />
      {/* Hero Section */}
      <section className="bg-white text-gray-800">
        <div className="px-4 lg:px-8 flex justify-between items-center gap-8 lg:gap-12">
          <div className="lg:max-w-xl flex flex-col justify-center text-center lg:text-left px-10">
            <h1 className="text-4xl font-extrabold leading-snug sm:text-5xl lg:text-7xl">
              Welcome to <span className="text-teal-600">Swift Mart</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Explore a world of incredible products at unmatched prices! From
              daily necessities to one-of-a-kind treasures, Swift Mart has
              everything you need. Shop effortlessly, anytime and anywhere.
            </p>
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
              <a
                href="/product"
                className="px-6 py-3 text-lg font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
              >
                Start Shopping
              </a>
              <a
                href="#testimonials"
                className="px-6 py-3 text-lg font-medium text-teal-600 border border-teal-600 rounded-lg hover:bg-gray-100"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="w-full lg:w-1/2 p-10">
            <img
              src="dash.png"
              alt="E-commerce Illustration"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="p-6 bg-gray-50 text-gray-800">
        <div className="">
          <span className="block mb-2 text-xs font-medium tracking-widest text-center uppercase text-teal-600">
            How it works
          </span>
          <h2 className="text-5xl font-bold text-center text-gray-900">
            Shopping with Swift Mart is Easy!
          </h2>
          <div className="grid gap-6 my-16 lg:grid-cols-3">
            <div className="flex flex-col p-8 space-y-4 rounded-md bg-gray-50">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-teal-600 text-gray-50">
                1
              </div>
              <p className="text-2xl font-semibold">
                <b>Browse Products</b> Explore a variety of products from
                categories that interest you.
              </p>
            </div>
            <div className="flex flex-col p-8 space-y-4 rounded-md bg-gray-50">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-teal-600 text-gray-50">
                2
              </div>
              <p className="text-2xl font-semibold">
                <b>Add to Cart</b> Choose your favorites and add them to your
                shopping cart.
              </p>
            </div>
            <div className="flex flex-col p-8 space-y-4 rounded-md bg-gray-50">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-teal-600 text-gray-50">
                3
              </div>
              <p className="text-2xl font-semibold">
                <b>Checkout</b> Proceed to checkout, select your payment method,
                and confirm your order!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 bg-white">
        <div className="px-4 lg:px-8">
          <span className="block mb-2 text-xs font-medium tracking-widest text-center uppercase text-teal-600">
            Sample Products
          </span>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Explore Our Top Picks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <img
                  src={product.image || "placeholder.jpg"}
                  alt={product.name || `Product ${index + 1}`}
                  className="object-cover w-full h-40 mb-4 rounded-lg"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.product_name || `Product ${index + 1}`}
                </h3>
                <p className="mt-2 text-md text-gray-600">
                  ₱{product.product_price || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-6 bg-white text-gray-900 border-t">
        <div className="grid max-w-6xl grid-cols-1 px-6 mx-auto lg:px-8 md:grid-cols-2 md:divide-x">
          <div className="py-6 md:py-0 md:px-6">
            <h1 className="text-4xl font-bold">Get in touch</h1>
            <p className="pt-2 pb-4">
              Fill in the form to start a conversation
            </p>
            <div className="space-y-4">
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mr-2 sm:mr-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Ampayon, Butuan City</span>
              </p>
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mr-2 sm:mr-6"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                <span>08-5225-5761</span>
              </p>
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mr-2 sm:mr-6"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <span>swiftmart@gmail.com</span>
              </p>
            </div>
          </div>
          <form
            noValidate=""
            className="flex flex-col py-6 space-y-6 md:py-0 md:px-6"
          >
            <label className="block">
              <span className="mb-1">Full name</span>
              <input
                type="text"
                placeholder="John Doe"
                className="block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-75 focus:ring-teal-600  bg-gray-100"
              />
            </label>
            <label className="block">
              <span className="mb-1">Email address</span>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-75 focus:ring-teal-600  bg-gray-100"
              />
            </label>
            <label className="block">
              <span className="mb-1">Message</span>
              <textarea
                rows="3"
                className="block w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-teal-600 bg-gray-100"
              ></textarea>
            </label>
            <button
              type="button"
              className="self-center px-8 py-3 text-lg rounded focus:ring hover:ring focus:ring-opacity-75 bg-teal-600 text-gray-50 focus:ring-teal-600 hover:ring-teal-600"
            >
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 divide-y bg-gray-100 text-gray-800">
        <div className="container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
          <div className="lg:w-1/3">
            <a
              rel="noopener noreferrer"
              href="#"
              className="flex justify-center space-x-3 lg:justify-start"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-600">
                <img src="logo.png" alt="logo" />
              </div>
              <span className="self-center text-2xl font-semibold">
                Swift Mart
              </span>
            </a>
          </div>
          <div className="grid grid-cols-2 text-sm gap-x-3 gap-y-8 lg:w-2/3 sm:grid-cols-4">
            <div className="space-y-3">
              <h3 className="tracking-wide uppercase text-gray-900">Shop</h3>
              <ul className="space-y-1">
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Categories
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Offers
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Best Sellers
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="tracking-wide uppercase text-gray-900">
                Customer Service
              </h3>
              <ul className="space-y-1">
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Shipping Information
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Returns & Exchanges
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    FAQs
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="uppercase text-gray-900">Company</h3>
              <ul className="space-y-1">
                <li>
                  <a rel="noopener noreferrer" href="#">
                    About Us
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="#">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="uppercase text-gray-900">Follow Us</div>
              <div className="flex justify-start space-x-3">
                <a
                  rel="noopener noreferrer"
                  href="#"
                  title="Facebook"
                  className="flex items-center p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    className="w-5 h-5 fill-current"
                  >
                    <path d="M32 16c0-8.839-7.167-16-16-16-8.839 0-16 7.161-16 16 0 7.984 5.849 14.604 13.5 15.803v-11.177h-4.063v-4.625h4.063v-3.527c0-4.009 2.385-6.223 6.041-6.223 1.751 0 3.584 0.312 3.584 0.312v3.937h-2.021c-1.984 0-2.604 1.235-2.604 2.5v3h4.437l-0.713 4.625h-3.724v11.177c7.645-1.199 13.5-7.819 13.5-15.803z"></path>
                  </svg>
                </a>
                <a
                  rel="noopener noreferrer"
                  href="#"
                  title="Twitter"
                  className="flex items-center p-1"
                >
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 fill-current"
                  >
                    <path d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.725 9.931 9.931 0 01-3.127 1.184A4.92 4.92 0 0016.616 2c-2.708 0-4.92 2.213-4.92 4.92 0 .385.043.76.127 1.118-4.087-.205-7.715-2.163-10.15-5.144A4.83 4.83 0 001.64 6.07c0 1.738.885 3.268 2.22 4.17-1.075-.032-2.087-.326-2.965-.812v.082c0 2.312 1.642 4.244 3.81 4.688-.398.109-.815.168-1.245.168-.304 0-.6-.03-.892-.085.6 1.875 2.335 3.242 4.382 3.278-1.607 1.26-3.627 2.017-5.828 2.017-.378 0-.75-.022-1.119-.065 2.085 1.337 4.567 2.118 7.271 2.118 8.719 0 13.496-7.216 13.496-13.496 0-.207 0-.417-.015-.626a9.731 9.731 0 002.379-2.483z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="py-4 text-xs text-center text-gray-400">
          <p>© 2025 Swift Mart. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Dashboard;
