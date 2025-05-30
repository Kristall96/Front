import React from "react";
import Label from "./Label";
import secureAxios from "../../../../../utils/secureAxios";

const ProductImageUploader = ({
  form,
  setForm,
  uploading,
  setUploading,
  renderError,
}) => {
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    setUploading(true);
    try {
      const res = await secureAxios.post("/upload/product-images", formData);
      const uploaded = res.data.uploaded;

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
        thumbnail: prev.thumbnail || uploaded[0],
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
      // Optional: Add frontend-only error state if needed
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (img) => {
    const updatedImages = form.images.filter((i) => i !== img);
    setForm({
      ...form,
      images: updatedImages,
      thumbnail:
        form.thumbnail === img ? updatedImages[0] || "" : form.thumbnail,
    });
  };

  const setThumbnail = (img) => {
    setForm({ ...form, thumbnail: img });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="fileUpload">Upload Images</Label>

      <div className="relative w-fit">
        <input
          id="fileUpload"
          type="file"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />
        <label
          htmlFor="fileUpload"
          className="cursor-pointer px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white inline-block"
        >
          📁 Browse Files
        </label>
      </div>

      {uploading && <p className="text-sm text-gray-400">Uploading...</p>}
      {renderError && renderError("images")}

      <div className="flex gap-2 flex-wrap mt-3">
        {form.images.map((img) => (
          <div key={img} className="relative border rounded shadow-sm">
            <img
              src={img}
              alt="Product"
              className="w-24 h-24 object-cover rounded"
            />

            <button
              type="button"
              onClick={() => setThumbnail(img)}
              className={`absolute top-1 right-1 text-xs px-2 py-1 rounded-full ${
                form.thumbnail === img ? "bg-green-600" : "bg-gray-600"
              } text-white`}
            >
              {form.thumbnail === img ? "✓" : "Set"}
            </button>

            <button
              type="button"
              onClick={() => removeImage(img)}
              className="absolute bottom-1 right-1 text-xs bg-red-500 text-white px-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageUploader;
