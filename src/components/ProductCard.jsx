import { Link } from "react-router-dom";

const ProductCard = ({ product, onDelete }) => {
  const {
    _id,
    title,
    finalPrice,
    imageUrl,
    variants,
    slug,
    source,
    isPublished,
    isFeatured,
    category,
    brand,
    stock,
    discountPercentage,
  } = product;

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
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {title}
        </h3>

        {/* Price & Discount */}
        <p className="text-sm text-gray-700">
          €{finalPrice?.toFixed(2)}{" "}
          {discountPercentage > 0 && (
            <span className="text-xs text-red-500">
              ({discountPercentage}% OFF)
            </span>
          )}
        </p>

        {/* Category & Brand */}
        <p className="text-xs text-gray-500">
          {category?.name || "No Category"} | {brand?.name || "No Brand"}
        </p>

        {/* Status */}
        <div className="flex gap-2 mt-1 text-xs">
          {isPublished && (
            <span className="px-2 py-0.5 rounded bg-green-600 text-white">
              Published
            </span>
          )}
          {isFeatured && (
            <span className="px-2 py-0.5 rounded bg-yellow-400 text-black">
              Featured
            </span>
          )}
          {!isPublished && !isFeatured && (
            <span className="px-2 py-0.5 rounded bg-gray-400 text-white">
              Draft
            </span>
          )}
        </div>

        {/* Variants + Stock */}
        <p className="text-xs text-gray-400">
          {variants?.length || 0} variant{variants?.length !== 1 ? "s" : ""} |{" "}
          {stock ?? 0} in stock
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          <Link
            to={`/product/${slug}`}
            className="flex-1 text-center bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition"
          >
            View
          </Link>

          <button
            className="flex-1 text-center bg-yellow-400 text-white px-3 py-1 text-sm rounded hover:bg-yellow-500 transition"
            disabled
          >
            Edit
          </button>

          <button
            onClick={() => onDelete && onDelete(_id)}
            className={`flex-1 text-center text-white px-3 py-1 text-sm rounded transition ${
              source === "printful"
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
            disabled={source === "printful"}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
