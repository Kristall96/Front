// src/pages/dashboard/sections/ProfileSection.jsx
import { useState, useEffect } from "react";
import secureAxios from "../../../utils/secureAxios";

const ProfileSection = ({ user, refreshUser }) => {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user) setFormData({ ...user });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { data } = await secureAxios.put("/users/me", formData);

      // Optional: log in dev
      if (import.meta.env.DEV) {
        console.log("✅ Profile updated:", data.user);
      }

      setMessage("✅ Profile updated successfully!");
      refreshUser?.();
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Failed to update profile.";
      setMessage(msg);

      if (import.meta.env.DEV) {
        console.error("⚠️ Update error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* 🧍 Identity Info */}
      <fieldset className="border p-4 rounded-md shadow bg-white">
        <legend className="font-semibold text-lg mb-2">Identity Info</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="username"
            value={formData.username || ""}
            onChange={handleChange}
            placeholder="Username"
            className="input"
          />
          <input
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            placeholder="First Name"
            className="input"
          />
          <input
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            placeholder="Last Name"
            className="input"
          />
        </div>
      </fieldset>

      {/* ☎ Contact Info */}
      <fieldset className="border p-4 rounded-md shadow bg-white">
        <legend className="font-semibold text-lg mb-2">Contact Info</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="Email"
            className="input"
          />
          <input
            name="secondaryEmail"
            value={formData.secondaryEmail || ""}
            onChange={handleChange}
            placeholder="Secondary Email"
            className="input"
          />
          <input
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="Phone"
            className="input"
          />
          <input
            name="secondaryPhone"
            value={formData.secondaryPhone || ""}
            onChange={handleChange}
            placeholder="Secondary Phone"
            className="input"
          />
        </div>
      </fieldset>

      {/* 🏠 Permanent Address */}
      <fieldset className="border p-4 rounded-md shadow bg-white">
        <legend className="font-semibold text-lg mb-2">
          Permanent Address
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="continent"
            value={formData.continent || ""}
            onChange={handleChange}
            placeholder="Continent"
            className="input"
          />
          <input
            name="country"
            value={formData.country || ""}
            onChange={handleChange}
            placeholder="Country"
            className="input"
          />
          <input
            name="region"
            value={formData.region || ""}
            onChange={handleChange}
            placeholder="Region"
            className="input"
          />
          <input
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            placeholder="City"
            className="input"
          />
          <input
            name="postalCode"
            value={formData.postalCode || ""}
            onChange={handleChange}
            placeholder="Postal Code"
            className="input"
          />
          <input
            name="streetAddress"
            value={formData.streetAddress || ""}
            onChange={handleChange}
            placeholder="Street Address"
            className="input"
          />
          <input
            name="apartment"
            value={formData.apartment || ""}
            onChange={handleChange}
            placeholder="Apartment/Suite"
            className="input"
          />
        </div>
      </fieldset>

      {/* 📦 Delivery Address */}
      <fieldset className="border p-4 rounded-md shadow bg-white">
        <legend className="font-semibold text-lg mb-2">Delivery Address</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="deliveryFirstName"
            value={formData.deliveryFirstName || ""}
            onChange={handleChange}
            placeholder="First Name"
            className="input"
          />
          <input
            name="deliveryLastName"
            value={formData.deliveryLastName || ""}
            onChange={handleChange}
            placeholder="Last Name"
            className="input"
          />
          <input
            name="deliveryPhone"
            value={formData.deliveryPhone || ""}
            onChange={handleChange}
            placeholder="Phone"
            className="input"
          />
          <input
            name="deliveryEmail"
            value={formData.deliveryEmail || ""}
            onChange={handleChange}
            placeholder="Email"
            className="input"
          />
          <input
            name="deliveryAddressLine1"
            value={formData.deliveryAddressLine1 || ""}
            onChange={handleChange}
            placeholder="Address Line 1"
            className="input"
          />
          <input
            name="deliveryAddressLine2"
            value={formData.deliveryAddressLine2 || ""}
            onChange={handleChange}
            placeholder="Address Line 2"
            className="input"
          />
          <input
            name="deliveryCity"
            value={formData.deliveryCity || ""}
            onChange={handleChange}
            placeholder="City"
            className="input"
          />
          <input
            name="deliveryState"
            value={formData.deliveryState || ""}
            onChange={handleChange}
            placeholder="State"
            className="input"
          />
          <input
            name="deliveryPostalCode"
            value={formData.deliveryPostalCode || ""}
            onChange={handleChange}
            placeholder="Postal Code"
            className="input"
          />
          <input
            name="deliveryCountryCode"
            value={formData.deliveryCountryCode || ""}
            onChange={handleChange}
            placeholder="Country Code"
            className="input"
          />
        </div>
      </fieldset>

      {/* 💾 Submit Button + Feedback */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-2 rounded-md text-white transition duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-900"
          }`}
          aria-busy={loading}
          aria-disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {message && (
          <span
            className={`text-sm font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </span>
        )}
      </div>
    </form>
  );
};

export default ProfileSection;
