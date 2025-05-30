import { useEffect, useState } from "react";
import ProductFields from "./ProductFields";
import ProductSelectors from "./ProductSelectors";
import ProductImageUploader from "./ProductImageUploader";
import ProductVariants from "./productVariants"; // fixed casing
import ToggleOptions from "./ToggleOptions";
import { fetchProductMeta } from "./ProductMetaLoader";

const ProductForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    brand: "",
    category: "",
    subcategory: "",
    images: [],
    thumbnail: "",
    basePrice: 0,
    salePrice: null,
    discountPercentage: 0,
    stock: 0,
    isPublished: false,
    isFeatured: false,
    variants: [],
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [variantCategories, setVariantCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
    fetchMeta();
  }, []);

  const fetchMeta = async () => {
    try {
      const { brands, categories, variantCategories } =
        await fetchProductMeta();
      setBrands(brands);
      setCategories(categories);
      setVariantCategories(variantCategories);
    } catch (err) {
      console.error("Metadata load failed", err);
      setGeneralError("Failed to load form options.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    const cleanedForm = {
      ...form,
      brand: form.brand?._id || form.brand,
      category: form.category?._id || form.category,
      variants: form.variants.map((v) => ({
        variantCategory: v.variantCategory?._id || v.variantCategory,
        value: v.value,
      })),
    };

    try {
      await onSubmit(cleanedForm);
    } catch (err) {
      const res = err?.response?.data;

      if (res?.errors && typeof res.errors === "object") {
        setErrors(res.errors);
      }

      const fallback =
        typeof res?.error === "string"
          ? res.error
          : typeof res?.error?.message === "string"
          ? res.error.message
          : typeof err?.message === "string"
          ? err.message
          : "Something went wrong.";
      setGeneralError(fallback);
    }
  };

  const renderError = (field) =>
    typeof errors[field] === "string" ? (
      <p className="text-sm text-red-400 mt-1">{errors[field]}</p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-700 space-y-8 text-white"
    >
      <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">
        🧾 Product Details
      </h2>

      {typeof generalError === "string" && generalError && (
        <div className="bg-red-600 text-white px-4 py-2 rounded shadow">
          {generalError}
        </div>
      )}

      <ProductFields form={form} setForm={setForm} renderError={renderError} />

      <ProductSelectors
        form={form}
        setForm={setForm}
        brands={brands}
        categories={categories}
        subcategories={subcategories}
        setSubcategories={setSubcategories}
        renderError={renderError}
      />

      <ProductImageUploader
        form={form}
        setForm={setForm}
        uploading={uploading}
        setUploading={setUploading}
      />

      <ProductVariants
        form={form}
        setForm={setForm}
        variantCategories={variantCategories}
        renderError={renderError}
      />

      <ToggleOptions form={form} setForm={setForm} />

      <button
        type="submit"
        className="w-full mt-6 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
      >
        {initialData ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;
