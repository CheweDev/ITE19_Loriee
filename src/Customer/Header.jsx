import { MdDashboard } from "react-icons/md";
import { AiOutlineShoppingCart, AiFillProduct } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";

const Header = () => {
  // State for toggling the user dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <>
      <header className="bg-[#5F99AE] text-white font-semibold px-4 sticky top-0 z-50">
        <div className="flex justify-between items-center h-16">
          <a
            rel="noopener noreferrer"
            href="#"
            aria-label="Back to homepage"
            className="flex items-center space-x-2"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full">
              <img src="logo.png" alt="logo" />
            </div>
            <p className="font-bold text-2xl tracking-widest">Richard's Shop</p>
          </a>

          <nav className="hidden md:flex items-center space-x-4">
            <ul className="flex space-x-4">
              <li className="relative">
                <a
                  href="/dashboard"
                  className="flex items-center px-4 py-2 text-gray-100 hover:text-teal-300 transition duration-200"
                >
                  <MdDashboard className="mr-2 w-5 h-5" />
                  Dashboard
                </a>
              </li>
              <li className="relative">
                <a
                  href="/product"
                  className="flex items-center px-4 py-2 text-gray-100 hover:text-teal-300 transition duration-200"
                >
                  <AiFillProduct className="mr-2 w-5 h-5" />
                  Products
                </a>
              </li>
              <li className="relative">
                <button
                  className="flex items-center px-4 py-2 text-gray-100 hover:text-teal-300 transition duration-200"
                  onClick={toggleDropdown}
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen ? "true" : "false"}
                >
                  <FaUserAlt className="mr-2 w-5 h-4" />
                  User
                </button>
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <ul
                    className="absolute left-0 mt-2 w-40 bg-white text-gray-600 border rounded-lg shadow-lg"
                    onClick={closeDropdown} // Close the dropdown when clicking an item
                  >
                    <li>
                      <a
                        href="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Profile
                      </a>
                    </li>
                    <li>
                      <a
                        href="/purchased"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        History
                      </a>
                    </li>
                    <hr />
                    <li>
                      <a href="/" className="block px-4 py-2 hover:bg-gray-100">
                        Logout
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li className="relative">
                <a
                  href="/cart"
                  className="flex items-center px-4 py-2 text-gray-100 hover:text-teal-300 transition duration-200"
                >
                  <AiOutlineShoppingCart className="mr-2 w-5 h-5" />
                  Cart
                </a>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-4" aria-label="Toggle Menu">
            <FiMenu className="w-6 h-6 text-white" />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
