import React, { useState, useEffect } from "react";
import secureAxios from "../../../../utils/secureAxios";
import { toast } from "react-toastify";
import InputField from "./InputField";
import CustomDropdown from "./CustomDropdown";
const defaultForm = {
  title: "",
  description: "",
  basePrice: "",
  salePrice: "",
  discountPercentage: "",
  stock: "",
  category: "",
  subcategory: "",
  brand: "",
  images: [],
  thumbnail: "",
  variants: [{ variantCategory: "", value: "" }],
  isPublished: false,
  isFeatured: false,
};

const ProductForm = ({ onSuccess, initialData = null }) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variantCategories, setVariantCategories] = useState([]);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        ...defaultForm,
        ...initialData,
        variants: initialData.variants?.length
          ? initialData.variants.map((v) => ({
              variantCategory: v.variantCategory || "",
              value: v.value || "",
              preview: v.previewImage || "",
            }))
          : [{ variantCategory: "", value: "" }],
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [initialData]);

  // Fetch meta (categories, brands, etc.)
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [cats, brs, vCats] = await Promise.all([
          secureAxios.get("/admin/categories"),
          secureAxios.get("/admin/brands"),
          secureAxios.get("/admin/variant-categories"),
        ]);
        setCategories(cats.data.categories || []);
        setBrands(brs.data.brands || []);
        setVariantCategories(vCats.data.categories || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load form data.");
      }
    };
    fetchMeta();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Auto-toggle logic: prevent both being true
      if (name === "isPublished" || name === "isFeatured") {
        const opposite = name === "isPublished" ? "isFeatured" : "isPublished";
        setForm((prev) => ({
          ...prev,
          [name]: checked,
          [opposite]: checked ? false : prev[opposite],
        }));
        return;
      }

      // Generic checkbox update
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      // Non-checkbox input update
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

  const handleThumbnailSelect = (url) => {
    setForm((prev) => ({ ...prev, thumbnail: url }));
  };

  const handleImageUpload = async (files) => {
    if (!files.length) return;
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("images", file);
        const res = await secureAxios.post("/upload/product-images", formData);
        if (res.data?.uploaded?.[0]) {
          uploadedUrls.push(res.data.uploaded[0]);
        } else {
          throw new Error("No URL returned.");
        }
      }

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
        thumbnail: prev.thumbnail || uploadedUrls[0],
      }));
    } catch (err) {
      toast.error("Image upload failed.");
      console.error(err.response?.data || err.message);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleImageUpload(Array.from(e.dataTransfer.files));
  };

  const handleFileInputChange = (e) => {
    handleImageUpload(Array.from(e.target.files));
  };

  const handleVariantPreviewUpload = async (index, file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await secureAxios.post("/upload/variant-preview", formData);
      const url = res.data.uploaded;

      setForm((prev) => {
        const updated = [...prev.variants];
        updated[index].preview = url;
        return { ...prev, variants: updated };
      });
    } catch (err) {
      toast.error("Variant image upload failed.");
      console.error(err);
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    console.log("🔥 handleSubmit called");

    e.preventDefault();

    if (isSubmitting) return; // 🛑 Prevent double submission
    setIsSubmitting(true); // 🔒 Lock submission

    setErrors({});

    try {
      const selectedCat = categories.find((cat) => cat._id === form.category);
      const selectedSub = selectedCat?.subcategories?.find(
        (s) => s.slug === form.subcategory
      );

      const payload = {
        ...form,
        subcategory: selectedSub
          ? { name: selectedSub.name, slug: selectedSub.slug }
          : { name: form.subcategory, slug: form.subcategory },
        basePrice: Number(form.basePrice),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        discountPercentage: form.discountPercentage
          ? Number(form.discountPercentage)
          : 0,
        stock: form.stock ? Number(form.stock) : 0,
        isPublished: !!form.isPublished,
        isFeatured: !!form.isFeatured,
        variants: form.variants.map((v) => ({
          variantCategory: v.variantCategory,
          value: v.value.trim(),
          previewImage: v.preview,
        })),
      };

      console.log("📤 Submitting payload:", payload);

      const isEdit = Boolean(initialData?._id);
      const res = isEdit
        ? await secureAxios.put(`/admin/products/${initialData._id}`, payload)
        : await secureAxios.post("/admin/products", payload);

      toast.success(isEdit ? "✅ Product updated!" : "✅ Product created!");
      onSuccess?.(res.data.product);
    } catch (err) {
      console.log("❌ Full error response:", err.response?.data);

      const validation = err.response?.data?.errors;
      if (validation) {
        const parsedErrors = {};

        Object.keys(validation).forEach((key) => {
          if (key.startsWith("variants.")) {
            const [, index, field] = key.split(".");
            const i = parseInt(index);
            if (!parsedErrors.variantsFields) parsedErrors.variantsFields = {};
            if (!parsedErrors.variantsFields[i])
              parsedErrors.variantsFields[i] = {};
            parsedErrors.variantsFields[i][field] = validation[key];
          } else if (key === "publishOrFeature") {
            parsedErrors.publishOrFeature = validation[key];
          } else {
            parsedErrors[key] = validation[key];
          }
        });

        setErrors(parsedErrors);
        toast.error("Please fix validation errors.");
      } else {
        toast.error(err.response?.data?.message || "Failed to save product.");
      }
    } finally {
      setIsSubmitting(false); // 🔓 Unlock submission
    }
  };

  const SelectField = ({
    label,
    name,
    value,
    onChange,
    options,
    error,
    defaultOption,
  }) => {
    const id = `select-${name}`;

    return (
      <div className="mb-6 relative">
        {/* Label */}
        <label
          htmlFor={id}
          className="block text-sm font-medium mb-2 text-gray-200"
        >
          {label}
        </label>

        {/* Select wrapper (icon + select field) */}
        <div className="relative">
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full appearance-none px-4 py-2.5 pr-10 rounded-md text-sm
            bg-[#2a3142] text-white border shadow-sm
            ${error ? "border-red-500" : "border-gray-600"}
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
            transition-all duration-650 ease-in-out
          `}
          >
            <option value="">{defaultOption}</option>
            {options.map((opt) => (
              <option key={opt._id} value={opt._id}>
                {opt.name}
              </option>
            ))}
          </select>

          {/* Dropdown icon */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-[#1a1f2b] text-white p-8 rounded-2xl shadow-2xl border border-gray-700"
    >
      {/* ── Basic Info ─────────────────────────────── */}
      <section>
        <InputField
          label="Product Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Product title"
        />
      </section>

      {/* ── Description ───────────────────────────── */}
      <section>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          placeholder="Enter detailed product description"
          className="w-full bg-[#2a3142] border border-gray-600 rounded-lg px-4 py-3"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-2">{errors.description}</p>
        )}
      </section>

      {/* ── Category & Brand ──────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomDropdown
          label="Select Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          options={categories}
          error={errors.category}
          defaultOption="-- Choose Category --"
        />
        {form.category && (
          <CustomDropdown
            label="Select Subcategory"
            name="subcategory"
            value={form.subcategory}
            onChange={handleChange}
            options={
              categories
                .find((cat) => cat._id === form.category)
                ?.subcategories?.map((sub) => ({
                  _id: sub.slug,
                  name: sub.name,
                })) || []
            }
            error={errors.subcategory}
            defaultOption="-- Choose Subcategory --"
          />
        )}

        <CustomDropdown
          label="Select Brand"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          options={brands}
          error={errors.brand}
          defaultOption="-- Choose Brand --"
        />
      </section>

      {/* ── Image Upload ─────────────────────────── */}
      <section>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-600 p-6 rounded-lg text-center bg-[#1f2634]"
        >
          <p className="mb-3 text-sm">Drag and drop images here or</p>
          <label
            htmlFor="fileInput"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm cursor-pointer"
          >
            Upload Images
          </label>
          <input
            id="fileInput"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          {errors.images && (
            <p className="text-red-500 text-xs mt-2">{errors.images}</p>
          )}
        </div>

        {/* Uploaded Thumbnails */}
        {form.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
            {form.images.map((url) => (
              <div
                key={url}
                onClick={() => handleThumbnailSelect(url)}
                className={`rounded-lg overflow-hidden cursor-pointer border-2 ${
                  form.thumbnail === url
                    ? "border-blue-500 ring-2 ring-blue-400"
                    : "border-gray-700"
                }`}
              >
                <img
                  src={url}
                  alt="Uploaded"
                  className="w-full h-24 object-cover"
                />
                {form.thumbnail === url && (
                  <p className="text-xs text-center text-blue-300 py-1 bg-gray-800">
                    Thumbnail
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Variant Options ──────────────────────── */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          🧬 Variant Options
        </h3>

        {form.variants.map((variant, index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row justify-between gap-6 bg-[#1a1f2b] border border-gray-700 rounded-xl p-5 shadow-sm"
          >
            {/* Left Column */}
            <div className="flex flex-col flex-1 gap-4">
              {/* Category */}
              <CustomDropdown
                label="Variant Category"
                name={`variantCategory-${index}`}
                value={variant.variantCategory}
                onChange={(e) =>
                  handleVariantChange(index, "variantCategory", e.target.value)
                }
                options={variantCategories}
                error={errors.variantsFields?.[index]?.variantCategory}
                defaultOption="Select Category"
              />

              {/* Value */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Variant Value
                </label>
                <input
                  type="text"
                  value={variant.value}
                  placeholder="e.g. Black, XL, 128GB"
                  onChange={(e) =>
                    handleVariantChange(index, "value", e.target.value)
                  }
                  className={`w-full bg-[#111827] border px-4 py-2.5 rounded-md text-white text-sm
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${
                errors.variantsFields?.[index]?.value
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
                />
                {errors.variantsFields?.[index]?.value && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.variantsFields[index].value}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Upload + Preview */}
            <div className="flex flex-col items-center gap-3 min-w-[100px]">
              <label
                htmlFor={`variant-file-${index}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm cursor-pointer transition"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v16h16M4 4l16 16"
                  />
                </svg>
                Upload
              </label>
              <input
                id={`variant-file-${index}`}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleVariantPreviewUpload(index, e.target.files[0])
                }
                className="hidden"
              />
              {variant.preview ? (
                <img
                  src={variant.preview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-500"
                />
              ) : (
                <div className="w-20 h-20 bg-[#111827] border border-gray-600 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                  No Image
                </div>
              )}
            </div>
          </div>
        ))}

        {errors.variants && (
          <p className="text-sm text-red-500">{errors.variants}</p>
        )}

        <button
          type="button"
          onClick={addVariant}
          className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition text-sm"
        >
          + Add Variant
        </button>
      </section>
      {/* ── Pricing Section ─────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Base Price (€)"
          name="basePrice"
          type="number"
          value={form.basePrice}
          onChange={handleChange}
          error={errors.basePrice}
          placeholder="Enter base price"
        />

        <InputField
          label="Sale Price (€)"
          name="salePrice"
          type="number"
          value={form.salePrice}
          onChange={handleChange}
          error={errors.salePrice}
          placeholder="Optional sale price"
        />

        <InputField
          label="Discount Percentage (%)"
          name="discountPercentage"
          type="number"
          value={form.discountPercentage}
          onChange={handleChange}
          error={errors.discountPercentage}
          placeholder="Optional discount (e.g. 10)"
        />

        <InputField
          label="Stock Quantity"
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          error={errors.stock}
          placeholder="Number of items in stock"
        />
      </section>

      {/* ── Toggles ──────────────────────────────── */}
      <section className="pt-4">
        <label className="block text-sm text-white font-medium mb-1">
          Choose product visibility
        </label>

        <p className="text-gray-400 text-xs mb-2">
          <strong>Published</strong>: visible in the store. <br />
          <strong>Featured</strong>: highlighted or promoted on the home page.
        </p>

        <div className="flex items-center gap-6 mb-1">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={form.isPublished}
              onChange={handleChange}
            />
            <span className="text-sm">Published</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
            />
            <span className="text-sm">Featured</span>
          </label>
        </div>

        {errors.publishOrFeature && (
          <p className="text-red-500 text-xs">{errors.publishOrFeature}</p>
        )}
      </section>

      {/* ── Submit ───────────────────────────────── */}
      <div className="pt-6 text-right">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded text-white shadow ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
