// components/ProductCard.jsx
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { _id, title, price, imageUrl, variants, slug } = product;

  return (
    <div className="rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition duration-200">
      <Link to={`/product/${slug}`} className="block">
        <img
          src={imageUrl || "/placeholder.jpg"}
          alt={title}
          className="w-full h-48 object-contain bg-gray-50"
          loading="lazy"
        />
      </Link>

      <div className="p-4 space-y-1">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {title}
        </h3>
        <p className="text-sm text-gray-600">${price?.toFixed(2)}</p>
        <p className="text-xs text-gray-400">
          {variants?.length || 0} variants
        </p>

        <div className="flex items-center gap-2 mt-3">
          <Link
            to={`/product/${slug}`}
            className="flex-1 text-center bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition"
          >
            View
          </Link>
          <button
            disabled
            className="flex-1 text-center bg-gray-300 text-gray-700 px-3 py-1 text-sm rounded cursor-not-allowed"
          >
            + Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
