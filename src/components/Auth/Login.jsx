import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Icons for showing/hiding the password
import { useNavigate } from "react-router-dom"; // Hook for navigation

function Login() {
  // State variables for managing form inputs and UI
  const [loading, setLoading] = useState(false); // Tracks loading state during login
  const [showPassword, setShowPassword] = useState(false); // Toggles password visibility
  const [role, setRole] = useState("customers"); // Stores the selected role (customer/admin)
  const [email, setEmail] = useState(""); // Stores the email input
  const [password, setPassword] = useState(""); // Stores the password input
  const navigate = useNavigate(); // For programmatic navigation

  // Toggles password visibility between plain text and hidden
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Handles the login process
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents default form submission behavior
    setLoading(true); // Indicates login is in progress
    try {
      // Fetches user data based on the selected role and email
      const response = await fetch(
        `http://localhost:1337/api/${role}?filters[email][$eq]=${email}`
      );
      const data = await response.json(); // Parses the JSON response
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch data");
      }

      // Checks if user data exists
      if (data.data.length === 0) {
        setError("Wrong Credentials"); // Sets error if no user found
        setLoading(false); // Stops loading
        // Resets form inputs and hides password after a delay
        setTimeout(() => {
          setEmail("");
          setPassword("");
          setShowPassword(false);
        }, 1500);
        return;
      }

      const user = data.data[0]; // Retrieves the first user
      // Validates password
      if (user.password !== password) {
        setLoading(false); // Stops loading
        // Resets form inputs and hides password after a delay
        setTimeout(() => {
          setEmail("");
          setPassword("");
          setShowPassword(false);
        }, 1500);
        return;
      }

      // Stores user data in sessionStorage
      sessionStorage.setItem("user", JSON.stringify(user));
      // Redirects based on the role
      if (role === "admins") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setLoading(false); // Stops loading on error
    }
  };

  return (
    <section className="p-6 bg-gray-100 text-gray-800 min-h-screen">
      <div className="grid gap-6 text-center lg:grid-cols-2 xl:grid-cols-5 mt-14">
        {/* Left Section: Login Form */}
        <div className="w-full px-6 py-16 rounded-md sm:px-12 md:px-16 xl:col-span-2 bg-white shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Login</h1>
          <p className="text-gray-600 mb-8">
            Sign in to your account and access all the features.
          </p>
          <form noValidate className="space-y-4" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"} // Toggles input type
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-teal-500 focus:border-teal-500"
              />
              {/* Toggle Visibility Button */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" /> // Eye-off icon
                ) : (
                  <FiEye className="h-5 w-5" /> // Eye icon
                )}
              </button>
            </div>
            {/* Role Dropdown and Login Button */}
            <div className="flex items-center gap-4">
              {/* Role Dropdown */}
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-4 py-2 border rounded-md focus:ring focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="customers">Customer</option>
                <option value="admins">Admin</option>
              </select>
              {/* Login Button */}
              <button
                type="submit"
                className="py-2 px-4 font-semibold rounded-md bg-teal-600 text-white hover:bg-teal-700 flex-grow flex items-center justify-center"
                disabled={loading} // Disables button during loading
              >
                {loading ? (
                  <svg
                    className="w-5 h-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    {/* Spinner for loading state */}
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  "Sign In" // Default button text
                )}
              </button>
            </div>
          </form>
          {/* Register Link */}
          <p className="mt-6 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-teal-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>

        {/* Right Section: Image */}
        <img
          src="img.jpg"
          alt="Login Illustration"
          className="object-cover w-full rounded-md xl:col-span-3 bg-gray-500 shadow-md"
        />
      </div>
    </section>
  );
}

export default Login;