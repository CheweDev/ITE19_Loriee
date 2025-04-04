import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Register() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const jsonData = {
      data: {
        name,
        email,
        password,
        address,
        phone_number: phoneNumber,
      },
    };

    setLoading(true);

    try {
      const response = await fetch("http://localhost:1337/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      setLoading(false);

      if (response.ok) {
        alert("Registration successful!");
        window.location.reload();
      } else {
        alert("Registration failed!");
      }
    } catch (error) {
      setLoading(false);
      alert("An error occurred while registering!");
    }
  };

  return (
    <section className="flex min-h-screen bg-gray-50 text-gray-800">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white p-8 rounded-md shadow-md">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Register
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Create an account to get started.
          </p>
          <form noValidate className="space-y-5" onSubmit={handleRegister}>
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-[#205781] focus:border-[#205781]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-[#205781] focus:border-[#205781]"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Address"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-[#205781] focus:border-[#205781]"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-[#205781] focus:border-[#205781]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-[#205781] focus:border-[#205781]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-[#205781] focus:border-[#205781]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-1/2 py-2 font-semibold rounded-md bg-[#205781] text-white flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="w-5 h-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
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
                  "Sign Up"
                )}
              </button>
            </div>
          </form>
          <p className="mt-6 text-sm text-gray-600 flex justify-center gap-1">
            Already have an account?
            <Link to="/" className="text-[#205781] underline">
              Login here
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 items-center justify-center">
        <img
          src="img3.jpg"
          alt="Register Illustration"
          className="object-cover w-full h-full"
        />
      </div>
    </section>
  );
}

export default Register;
