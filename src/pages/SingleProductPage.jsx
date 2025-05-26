import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/secureAxios";
import Navbar from "../components/Navbar";

const SingleProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/slug/${slug}`);
        const productData = res.data;

        const validVariants =
          productData.variants?.filter((v) => v?.variantId) || [];

        setProduct(productData);
        setSelectedVariant(validVariants[0] || null);

        // Prefer thumbnail or first image
        const initialImage =
          productData.thumbnail || productData.images?.[0] || "";
        setSelectedImage(initialImage);
      } catch (err) {
        setError(err.response?.data?.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 text-lg">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600 font-semibold">{error}</div>
    );
  }

  if (!product) return null;

  const handleVariantChange = (variantId) => {
    const selected = product.variants.find((v) => v.variantId === variantId);
    setSelectedVariant(selected);
    if (selected?.preview) {
      setSelectedImage(selected.preview);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Image Section */}
          <div className="w-full md:w-1/2">
            <div className="border rounded-lg bg-white p-2 shadow-sm">
              <img
                src={selectedImage || "/placeholder.jpg"}
                alt={product.title}
                className="w-full h-[400px] object-contain rounded"
              />
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                      img === selectedImage
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                    alt={`thumbnail-${index}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-between space-y-4">
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
                    onChange={(e) => handleVariantChange(e.target.value)}
                  >
                    {product.variants
                      .filter((v) => v.variantId && v.size && v.color)
                      .map((v) => (
                        <option key={v.variantId} value={v.variantId}>
                          {v.size} • {v.color} • ${v.retail_price?.toFixed(2)}
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
    </>
  );
};

export default SingleProductPage;
