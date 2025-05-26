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
        setError(
          "Product not found",
          err.response?.data?.message || "Unknown error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex gap-6">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-64 h-64 object-contain border rounded"
        />
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-gray-600">${product.price?.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2">{product.description}</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-lg">Variants</h3>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          {product.variants.map((v) => (
            <li
              key={v.variantId}
              className="border p-2 rounded text-sm bg-gray-50"
            >
              <img
                src={v.preview}
                alt={`${v.color} ${v.size}`}
                className="h-20 w-full object-contain mb-1"
              />
              {v.size} • {v.color} • ${v.retail_price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SingleProductPage;
