import React, { useEffect, useState } from "react";
import secureAxios from "../../../../utils/secureAxios";

import ProductForm from "./ProductForm";

const ViewProductModal = ({
  viewingProduct,
  setViewingProduct,
  isEditing,
  setIsEditing,
  fetchProducts,
}) => {
  const [editHistory, setEditHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("history");
  const [variantCategoryMap, setVariantCategoryMap] = useState({});
  const [categoryMap, setCategoryMap] = useState({});
  const [subcategoryMap, setSubcategoryMap] = useState({});
  const [brandMap, setBrandMap] = useState({});
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await secureAxios.get("/admin/brands");

        const map = {};
        res.data?.brands?.forEach((b) => {
          map[b._id] = b.name;
        });

        setBrandMap(map);
      } catch (err) {
        console.error("❌ Failed to fetch brands", err);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await secureAxios.get("/admin/categories");

        const categoryMap = {};
        const subcategoryMap = {};

        res.data?.categories?.forEach((cat) => {
          categoryMap[cat._id] = cat.name;

          cat.subcategories?.forEach((sub) => {
            subcategoryMap[sub.slug] = sub.name;
          });
        });

        setCategoryMap(categoryMap);
        setSubcategoryMap(subcategoryMap);
      } catch (err) {
        console.error("❌ Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Fetch variant categories once on mount
  useEffect(() => {
    const fetchVariantCategories = async () => {
      try {
        const res = await secureAxios.get("/admin/variant-categories");

        const categories = res.data?.categories;
        console.log("🧩 Variant categories:", categories);

        if (!Array.isArray(categories)) {
          throw new TypeError("Expected categories to be an array");
        }

        const map = {};
        categories.forEach((vc) => {
          map[vc._id] = vc.name;
        });

        setVariantCategoryMap(map);
      } catch (err) {
        console.error("❌ Failed to fetch variant categories", err);
      }
    };

    fetchVariantCategories();
  }, []);

  // ✅ Fetch edit history when viewingProduct changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!viewingProduct?._id) return;

      setLoadingHistory(true);
      try {
        const res = await secureAxios.get(
          `/admin/products/${viewingProduct._id}/history`
        );
        const history = res.data?.history || [];

        console.log("🧾 Raw edit history response:", res.data);
        console.log("✅ Parsed editHistory:", history);

        setEditHistory(Array.isArray(history) ? history : []);
      } catch (err) {
        console.error("❌ Failed to fetch edit history", err);
        setEditHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [viewingProduct?._id]); // ✅ Safer dependency
  useEffect(() => {
    if (viewingProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [viewingProduct]);

  // ✅ Don’t render until the product exists
  if (!viewingProduct) return null;

  const {
    title,
    description,
    brand,
    category,
    subcategory,
    images,
    thumbnail,
    variants,
    basePrice,
    salePrice,
    discountPercentage,
    stock,
    lowStockAlert,
    averageRating,
    ratingCount,
    isPublished,
    isFeatured,
    source,
    createdAt,
    updatedAt,
    currentPrice,
    margin,
  } = viewingProduct;

  const tryPrettify = (value, field) => {
    if (!value) return "—";

    try {
      if (field === "subcategory") {
        const obj = typeof value === "string" ? JSON.parse(value) : value;
        return subcategoryMap[obj?.slug] || obj?.name || "—";
      }

      if (field === "category") {
        const id = typeof value === "string" ? value : value?._id;
        return categoryMap[id] || id;
      }

      if (field === "brand") {
        const id = typeof value === "string" ? value : value?._id;
        return brandMap[id] || id;
      }

      if (typeof value === "object") return JSON.stringify(value, null, 2);
      if (
        typeof value === "string" &&
        (value.startsWith("{") || value.startsWith("["))
      ) {
        return JSON.stringify(JSON.parse(value), null, 2);
      }

      return value;
    } catch (e) {
      return String(value, e);
    }
  };

  const formatVariants = (variantStringOrArray) => {
    try {
      const parsed =
        typeof variantStringOrArray === "string"
          ? JSON.parse(variantStringOrArray)
          : variantStringOrArray;

      if (!Array.isArray(parsed)) return "—";

      return parsed
        .map((variant) => {
          const categoryId =
            typeof variant.variantCategory === "object"
              ? variant.variantCategory.$oid
              : variant.variantCategory;
          const categoryName = variantCategoryMap[categoryId] || categoryId;
          return `${categoryName}: ${variant.value}`;
        })
        .join(", ");
    } catch (e) {
      return String(variantStringOrArray, e);
    }
  };
  const Info = ({ label, value }) => (
    <div className="min-w-0">
      <div className="text-[11px] text-gray-400 uppercase tracking-wide mb-1 leading-tight">
        {label}
      </div>
      <div className="text-[17px] text-gray-100 font-semibold break-words">
        {value || "—"}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/70 flex justify-center items-start p-10 overflow-y-auto">
      <div className="bg-[#1e293b] w-full max-w-7xl p-6 rounded-2xl shadow-2xl relative text-white border border-gray-700">
        {/* Top Right Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-1.5 rounded-md font-semibold text-sm transition duration-200 ${
              isEditing
                ? "bg-gray-600 hover:bg-gray-500"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isEditing ? "Cancel Edit" : "✏️ Edit Product"}
          </button>
          <button
            onClick={() => {
              setViewingProduct(null);
              setIsEditing(false);
            }}
            className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-red-600 text-white text-lg font-bold flex items-center justify-center transition-all duration-200 shadow-md"
            title="Close"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Modal Header */}
        <h2 className="text-3xl font-bold mb-6">
          {isEditing ? "Edit Product" : "🧾 Product Overview"}
        </h2>

        {isEditing ? (
          <ProductForm
            initialData={viewingProduct}
            onSuccess={() => {
              setIsEditing(false);
              setViewingProduct(null);
              fetchProducts();
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Wrapped Thumbnail + Title + Info into a card */}
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-md text-gray-200">
                {/* Thumbnail */}
                <div className="rounded-xl overflow-hidden border border-gray-700 mb-6">
                  <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-74 object-cover transition duration-300 hover:scale-[1.01]"
                  />
                </div>

                {/* Title */}
                <div className="text-center pb-4 border-b border-gray-700">
                  <h2 className="text-4xl font-bold text-white tracking-tight">
                    {title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Detailed product information
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-sm mt-6">
                  <Info label="Brand" value={brand?.name || brand} />
                  <Info label="Category" value={category?.name || category} />
                  <Info
                    label="Subcategory"
                    value={subcategory?.name || subcategory}
                  />
                  <Info label="Stock" value={stock} />
                  <Info
                    label="Low Stock Alert"
                    value={lowStockAlert ? "⚠️ Yes" : "No"}
                  />
                  <Info label="Base Price" value={`€${basePrice}`} />
                  <Info
                    label="Sale Price"
                    value={salePrice ? `€${salePrice}` : "—"}
                  />
                  <Info
                    label="Discount %"
                    value={`${discountPercentage || 0}%`}
                  />
                  <Info label="Current Price" value={`€${currentPrice}`} />
                  <Info label="Margin" value={`€${margin}`} />
                  <Info
                    label="Avg Rating"
                    value={`${averageRating} (${ratingCount})`}
                  />
                  <Info
                    label="Published"
                    value={isPublished ? "✅ Yes" : "❌ No"}
                  />
                  <Info label="Featured" value={isFeatured ? "🌟 Yes" : "—"} />
                  <Info label="Source" value={source} />
                  <Info
                    label="Created"
                    value={new Date(createdAt).toLocaleString()}
                  />
                  <Info
                    label="Updated"
                    value={new Date(updatedAt).toLocaleString()}
                  />
                </div>
              </div>

              {/* Description Block Below */}
              <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-sm">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  📝 <span>Description</span>
                </h3>
                <p className="text-sm text-gray-300 whitespace-pre-line">
                  {description}
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* IMAGES */}
              <div className="rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-sm space-y-4">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  🖼️ Images
                </h3>

                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                  {images?.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-md overflow-hidden border border-gray-600 hover:border-gray-400 transition"
                    >
                      <img
                        src={img}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      {/* Optional overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-gray-200 font-medium transition">
                        Preview
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VARIANTS */}
              <div className="rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-sm space-y-4">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  🎨 Variants
                </h3>

                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {variants?.map((variant, i) => (
                    <li
                      key={variant._id || i}
                      className="flex items-center gap-3 p-2 rounded-md border border-gray-700 hover:border-gray-500 transition"
                    >
                      <img
                        src={variant.previewImage}
                        alt={variant.value}
                        className="w-16 h-16 object-cover rounded border border-gray-600"
                      />

                      <div className="text-[11px] text-gray-300 leading-snug space-y-0.5">
                        <div className="flex gap-1">
                          <span className="uppercase text-gray-500 tracking-wide">
                            Category:
                          </span>
                          <span className="font-medium text-white">
                            {variantCategoryMap[variant.variantCategory] ||
                              variant.variantCategory}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <span className="uppercase text-gray-500 tracking-wide">
                            Value:
                          </span>
                          <span className="font-medium text-white">
                            {variant.value}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* TABS: HISTORY / NOTES */}
              <div className="border border-gray-700 rounded-xl bg-gray-900">
                <div className="grid grid-cols-2 border-b border-gray-700 bg-gray-800 rounded-t-xl overflow-hidden">
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`p-4 font-semibold text-left transition-colors duration-200 ${
                      activeTab === "history"
                        ? "text-white border-b-2 border-emerald-400 bg-gray-900"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    🕓 Edit History
                  </button>
                  <button
                    onClick={() => setActiveTab("notes")}
                    className={`p-4 font-semibold text-left transition-colors duration-200 ${
                      activeTab === "notes"
                        ? "text-white border-b-2 border-emerald-400 bg-gray-900"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    📝 Notes
                  </button>
                </div>

                <div className="p-6 text-[15px] space-y-6 max-h-[150vh] overflow-y-auto">
                  {activeTab === "history" ? (
                    loadingHistory ? (
                      <p className="text-gray-400">Loading history...</p>
                    ) : editHistory.length === 0 ? (
                      <p className="text-gray-400">No edits made yet.</p>
                    ) : (
                      editHistory.map((entry, idx) => {
                        if (!entry || !entry.editedBy) return null;

                        return (
                          <div
                            key={idx}
                            className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-md space-y-4"
                          >
                            <p className="mb-1 text-white font-semibold tracking-wide">
                              {entry.editedBy.firstName || "Unknown"}{" "}
                              {entry.editedBy.lastName || ""}{" "}
                              <span className="text-sm text-gray-400 font-normal">
                                – {entry.editedBy.role}
                              </span>
                            </p>
                            <p className="text-gray-500 text-xs mb-3 italic">
                              {new Date(entry.editedAt).toLocaleString()}
                            </p>
                            <div className="divide-y divide-gray-700">
                              {entry.changes.map((change, i) => {
                                const from = change.from;
                                const to = change.to;
                                const isEqual =
                                  JSON.stringify(from) === JSON.stringify(to);
                                if (isEqual) return null;

                                return (
                                  <div key={i} className="py-3">
                                    <div className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                      {change.field}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div>
                                        <span className="text-gray-400 block text-[11px] uppercase tracking-wide mb-1">
                                          From
                                        </span>
                                        <div className="bg-slate-900 p-2 rounded-md text-rose-300 border border-rose-500 whitespace-pre-wrap break-words">
                                          {change.field === "variants"
                                            ? formatVariants(from)
                                            : tryPrettify(from, change.field)}
                                        </div>
                                      </div>
                                      <div>
                                        <span className="text-gray-400 block text-[11px] uppercase tracking-wide mb-1">
                                          To
                                        </span>
                                        <div className="bg-slate-900 p-2 rounded-md text-emerald-300 border border-emerald-500 whitespace-pre-wrap break-words">
                                          {change.field === "variants"
                                            ? formatVariants(to)
                                            : tryPrettify(to, change.field)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    )
                  ) : editHistory.length === 0 ? (
                    <p className="text-gray-400">No notes yet.</p>
                  ) : (
                    editHistory.map((entry, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                      >
                        <p className="text-white mb-1 font-semibold">
                          {entry.editedBy.firstName?.trim() || "Admin"}{" "}
                          {entry.editedBy.lastName?.trim() || ""}
                          {entry.editedBy.role
                            ? ` (${entry.editedBy.role})`
                            : ""}
                        </p>
                        <p className="italic text-gray-300">
                          {entry.reason || "No reason provided."}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProductModal;
