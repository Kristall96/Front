import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ProductForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    basePrice: "",
    category: "",
    brand: "",
    images: [],
    thumbnail: "",
    variants: [{ variantCategory: "", value: "" }],
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variantCategories, setVariantCategories] = useState([]);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [cats, brs, vCats] = await Promise.all([
          axios.get("/api/categories"),
          axios.get("/api/brands"),
          axios.get("/api/variant-categories"),
        ]);
        setCategories(cats.data.categories);
        setBrands(brs.data.brands);
        setVariantCategories(vCats.data.categories);
      } catch (err) {
        toast.error(
          "Failed to load form metadata.",
          err.response?.data?.message || "Error"
        );
      }
    };
    fetchMeta();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (files) => {
    if (!files.length) return;

    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.url) {
          uploadedUrls.push(data.url);
        } else {
          throw new Error(data.message || "Upload failed");
        }
      }

      setForm((prev) => {
        const newImages = [...prev.images, ...uploadedUrls];
        return {
          ...prev,
          images: newImages,
          thumbnail: prev.thumbnail || uploadedUrls[0],
        };
      });
    } catch (err) {
      toast.error("Image upload failed.");
      console.error("Upload error:", err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleImageUpload(files);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleImageUpload(files);
  };

  const handleThumbnailSelect = (url) => {
    setForm((prev) => ({ ...prev, thumbnail: url }));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...form.variants];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, variants: updated }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { variantCategory: "", value: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      const res = await axios.post("/api/admin/products", payload);
      toast.success("Product created successfully!");
      onSuccess?.(res.data.product);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating product.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="title"
        placeholder="Product Title"
        value={form.title}
        onChange={handleChange}
        required
        className="input"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
        className="textarea"
      />

      <input
        type="number"
        name="basePrice"
        placeholder="Base Price"
        value={form.basePrice}
        onChange={handleChange}
        required
        className="input"
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
        className="select"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        name="brand"
        value={form.brand}
        onChange={handleChange}
        required
        className="select"
      >
        <option value="">Select Brand</option>
        {brands.map((b) => (
          <option key={b._id} value={b._id}>
            {b.name}
          </option>
        ))}
      </select>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-dashed border-2 p-4 text-center cursor-pointer"
      >
        <p>Drag and drop images here, or click to select</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="btn mt-2">
          Browse Images
        </label>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {form.images.map((url) => (
          <div
            key={url}
            className={`border-2 p-1 cursor-pointer rounded ${
              form.thumbnail === url ? "border-blue-500" : "border-transparent"
            }`}
            onClick={() => handleThumbnailSelect(url)}
          >
            <img
              src={url}
              alt="Uploaded"
              className="w-full h-24 object-cover"
            />
            {form.thumbnail === url && (
              <p className="text-xs text-blue-600 text-center">Thumbnail</p>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {form.variants.map((variant, index) => (
          <div key={index} className="flex gap-2">
            <select
              value={variant.variantCategory}
              onChange={(e) =>
                handleVariantChange(index, "variantCategory", e.target.value)
              }
              className="select"
            >
              <option value="">Select Variant Category</option>
              {variantCategories.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Value"
              value={variant.value}
              onChange={(e) =>
                handleVariantChange(index, "value", e.target.value)
              }
              className="input"
            />
          </div>
        ))}
        <button type="button" onClick={addVariant} className="btn">
          + Add Variant
        </button>
      </div>

      <button type="submit" className="btn btn-primary">
        Create Product
      </button>
    </form>
  );
};

export default ProductForm;
