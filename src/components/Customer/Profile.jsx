import React, { useState } from "react";
import Header from "./Header";

const Profile = () => {
  // Static user data (mocked for now)
  const initialUser = {
    name: "Marc Dom Gerasmio",
    email: "gwapoK0@gmail.com",
    phone: "09518149753",
    address: "Villa Paraiso, Ampayon Butuan City",
    joinedDate: "1980-03-15",
  };

  // States
  const [user, setUser] = useState(initialUser); // Current user data
  const [isEditing, setIsEditing] = useState(false); // Edit mode
  const [formData, setFormData] = useState(initialUser); // Form data for editing

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Save changes
  const handleSave = () => {
    setUser(formData); // Update user data
    setIsEditing(false); // Exit edit mode
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(user); // Reset form data to current user info
    setIsEditing(false); // Exit edit mode
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-5">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
          <div className="p-6">
            {/* Profile View */}
            {!isEditing ? (
              <>
                {/* Profile Picture */}
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-500">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                </div>

                {/* User Details */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    Member since:{" "}
                    {new Date(user.joinedDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <label className="w-32 text-gray-600 font-medium">
                      Email:
                    </label>
                    <span className="text-gray-800">{user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <label className="w-32 text-gray-600 font-medium">
                      Phone:
                    </label>
                    <span className="text-gray-800">{user.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <label className="w-32 text-gray-600 font-medium">
                      Address:
                    </label>
                    <span className="text-gray-800">{user.address}</span>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="text-center mt-6">
                  <button
                    className="btn bg-teal-700 text-white px-6 py-2 rounded-lg"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Edit Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">
                      Name:
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input input-bordered border border-gray-300 rounded-lg p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">
                      Email:
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input input-bordered border border-gray-300 rounded-lg p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">
                      Phone:
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input input-bordered border border-gray-300 rounded-lg p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">
                      Address:
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="input input-bordered border border-gray-300 rounded-lg p-2 w-full"
                    />
                  </div>
                </div>

                {/* Save/Cancel Buttons */}
                <div className="text-center mt-6 flex justify-center gap-4">
                  <button
                    className="btn bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="btn bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
