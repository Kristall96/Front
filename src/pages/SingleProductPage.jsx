import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/secureAxios";

const SingleProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/slug/${slug}`);
        setProduct(res.data);
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
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Product Header */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Image Section */}
        <div className="flex-shrink-0 w-full md:w-1/2">
          <img
            src={product.imageUrl || "/placeholder.jpg"}
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
              ${product.price?.toFixed(2)}
            </p>
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-6">
            <button
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
              disabled
            >
              Add to Cart (coming soon)
            </button>
          </div>
        </div>
      </div>

      {/* Variant Section */}
      {product.variants?.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Available Variants
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {product.variants.map((v) => (
              <div
                key={v.variantId}
                className="border rounded-xl p-4 bg-gray-50 hover:shadow-md transition"
              >
                <img
                  src={v.preview || "/placeholder.jpg"}
                  alt={`${v.color} ${v.size}`}
                  className="h-28 w-full object-contain mb-3 rounded"
                />
                <div className="text-sm text-gray-700">
                  <p className="font-medium">
                    {v.size} • {v.color}
                  </p>
                  <p className="text-gray-500">${v.retail_price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProductPage;
