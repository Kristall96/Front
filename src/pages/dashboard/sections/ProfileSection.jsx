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
      if (import.meta.env.DEV) console.log("✅ Profile updated:", data.user);
      setMessage("✅ Profile updated successfully!");
      refreshUser?.();
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Failed to update profile.";
      setMessage(msg);
      if (import.meta.env.DEV) console.error("⚠️ Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (props) => (
    <input
      {...props}
      className="w-full px-4 py-2 rounded-md bg-[#1e2633] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );

  return (
    <div className="flex justify-center items-start px-2 py-6 bg-[#131a25]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-[#1b2431] p-6 rounded-2xl shadow-xl border border-gray-700 text-white"
        style={{
          minHeight: 0,
          maxHeight: "calc(100vh - 5rem)",
          overflowY: "auto",
        }}
      >
        {/* --- Avatar & Title --- */}
        <div className="flex items-center gap-5 mb-8">
          <img
            src={
              formData.profileImage || "https://example.com/default-avatar.png"
            }
            alt="Profile Avatar"
            className="w-16 h-16 rounded-full border-2 border-blue-500 shadow"
          />
          <div>
            <h2 className="text-2xl font-bold mb-1">Edit Your Profile</h2>
            <p className="text-xs text-gray-300 font-medium">
              Level: {formData.level || 1}
            </p>
            {formData.badge && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full shadow-sm">
                Badge: {formData.badge}
              </span>
            )}
          </div>
        </div>

        {/* --- Main Grid: 2 columns (left/right) for desktop --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* --- LEFT COLUMN --- */}
          <div className="flex flex-col gap-8">
            {/* Identity Info */}
            <fieldset className="border border-gray-600 p-4 rounded-lg flex-1 min-h-[232px]">
              <legend className="font-semibold text-base px-2">
                Identity Info
              </legend>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {renderInput({
                  name: "username",
                  value: formData.username || "",
                  onChange: handleChange,
                  placeholder: "Username",
                })}
                {renderInput({
                  name: "firstName",
                  value: formData.firstName || "",
                  onChange: handleChange,
                  placeholder: "First Name",
                })}
                {renderInput({
                  name: "middleName",
                  value: formData.middleName || "",
                  onChange: handleChange,
                  placeholder: "Middle Name",
                })}
                {renderInput({
                  name: "lastName",
                  value: formData.lastName || "",
                  onChange: handleChange,
                  placeholder: "Last Name",
                })}
                {/* Filler div to keep next row in line */}
                <div />
                <div />
                {/* Full width Bio */}
                <textarea
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  placeholder="Bio"
                  rows={2}
                  className="col-span-3 w-full px-3 py-1.5 rounded-md bg-[#1e2633] text-white border border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </fieldset>

            {/* Permanent Address */}
            <fieldset className="border border-gray-600 p-4 rounded-lg flex-1 min-h-[232px]">
              <legend className="font-semibold text-base px-2">
                Permanent Address
              </legend>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {renderInput({
                  name: "continent",
                  value: formData.continent || "",
                  onChange: handleChange,
                  placeholder: "Continent",
                })}
                {renderInput({
                  name: "country",
                  value: formData.country || "",
                  onChange: handleChange,
                  placeholder: "Country",
                })}
                {renderInput({
                  name: "region",
                  value: formData.region || "",
                  onChange: handleChange,
                  placeholder: "Region",
                })}
                {renderInput({
                  name: "city",
                  value: formData.city || "",
                  onChange: handleChange,
                  placeholder: "City",
                })}
                {renderInput({
                  name: "postalCode",
                  value: formData.postalCode || "",
                  onChange: handleChange,
                  placeholder: "Postal Code",
                })}
                {renderInput({
                  name: "streetAddress",
                  value: formData.streetAddress || "",
                  onChange: handleChange,
                  placeholder: "Street Address",
                })}
                {/* Full width Apartment/Suite */}
                {renderInput({
                  name: "apartment",
                  value: formData.apartment || "",
                  onChange: handleChange,
                  placeholder: "Apartment/Suite",
                  className: "col-span-3",
                })}
              </div>
            </fieldset>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="flex flex-col gap-8">
            {/* Contact Info */}
            <fieldset className="border border-gray-600 p-4 rounded-lg flex-1 min-h-[232px]">
              <legend className="font-semibold text-base px-2">
                Contact Info
              </legend>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {renderInput({
                  name: "email",
                  value: formData.email || "",
                  onChange: handleChange,
                  placeholder: "Email",
                })}
                {renderInput({
                  name: "secondaryEmail",
                  value: formData.secondaryEmail || "",
                  onChange: handleChange,
                  placeholder: "Secondary Email",
                })}
                {renderInput({
                  name: "phone",
                  value: formData.phone || "",
                  onChange: handleChange,
                  placeholder: "Phone",
                })}
                {renderInput({
                  name: "secondaryPhone",
                  value: formData.secondaryPhone || "",
                  onChange: handleChange,
                  placeholder: "Secondary Phone",
                })}
                {/* Fill remaining slots to align */}
                <div />
                <div />
              </div>
            </fieldset>

            {/* Delivery Address */}
            <fieldset className="border border-gray-600 p-4 rounded-lg flex-1 min-h-[232px]">
              <legend className="font-semibold text-base px-2">
                Delivery Address
              </legend>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {renderInput({
                  name: "deliveryFirstName",
                  value: formData.deliveryFirstName || "",
                  onChange: handleChange,
                  placeholder: "First Name",
                })}
                {renderInput({
                  name: "deliveryMiddleName",
                  value: formData.deliveryMiddleName || "",
                  onChange: handleChange,
                  placeholder: "Middle Name",
                })}
                {renderInput({
                  name: "deliveryLastName",
                  value: formData.deliveryLastName || "",
                  onChange: handleChange,
                  placeholder: "Last Name",
                })}
                {renderInput({
                  name: "deliveryPhone",
                  value: formData.deliveryPhone || "",
                  onChange: handleChange,
                  placeholder: "Phone",
                })}
                {renderInput({
                  name: "deliveryEmail",
                  value: formData.deliveryEmail || "",
                  onChange: handleChange,
                  placeholder: "Email",
                })}
                {renderInput({
                  name: "deliveryAddressLine1",
                  value: formData.deliveryAddressLine1 || "",
                  onChange: handleChange,
                  placeholder: "Address Line 1",
                })}
                {renderInput({
                  name: "deliveryAddressLine2",
                  value: formData.deliveryAddressLine2 || "",
                  onChange: handleChange,
                  placeholder: "Address Line 2",
                })}
                {renderInput({
                  name: "deliveryCity",
                  value: formData.deliveryCity || "",
                  onChange: handleChange,
                  placeholder: "City",
                })}
                {renderInput({
                  name: "deliveryState",
                  value: formData.deliveryState || "",
                  onChange: handleChange,
                  placeholder: "State",
                })}
                {renderInput({
                  name: "deliveryPostalCode",
                  value: formData.deliveryPostalCode || "",
                  onChange: handleChange,
                  placeholder: "Postal Code",
                })}
                {renderInput({
                  name: "deliveryCountryCode",
                  value: formData.deliveryCountryCode || "",
                  onChange: handleChange,
                  placeholder: "Country Code",
                  className: "col-span-3",
                })}
              </div>
            </fieldset>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 font-semibold rounded-md text-white transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          {message && (
            <span
              className={`text-sm font-medium ${
                message.startsWith("✅") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;
