import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/secureAxios";

const SingleProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/slug/${slug}`);
        setProduct(res.data);
        setSelectedVariant(res.data.variants?.[0] || null); // default selection
      } catch (err) {
        setError(err.response?.data?.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 text-lg">Loading...</div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-600 font-semibold">{error}</div>
    );

  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Product Header */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Image Section */}
        <div className="flex-shrink-0 w-full md:w-1/2">
          <img
            src={
              selectedVariant?.preview || product.imageUrl || "/placeholder.jpg"
            }
            alt={product.title}
            className="w-full h-auto max-h-[400px] object-contain rounded-xl border bg-white shadow"
          />
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-between space-y-4 w-full md:w-1/2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {product.title}
            </h1>
            <p className="text-xl text-blue-600 font-semibold">
              ${selectedVariant?.retail_price || product.price?.toFixed(2)}
            </p>
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Variant Dropdown */}
            {product.variants?.length > 0 && (
              <div className="mt-6">
                <label
                  htmlFor="variant-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Choose Variant
                </label>
                <select
                  id="variant-select"
                  className="w-full border rounded-md p-2 text-sm focus:ring focus:ring-blue-200"
                  value={selectedVariant?.variantId || ""}
                  onChange={(e) => {
                    const selected = product.variants.find(
                      (v) => v.variantId === e.target.value
                    );
                    setSelectedVariant(selected);
                  }}
                >
                  {product.variants.map((v) => (
                    <option key={v.variantId} value={v.variantId}>
                      {v.size} • {v.color} • ${v.retail_price}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
              disabled={!selectedVariant}
            >
              Add to Cart (coming soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
