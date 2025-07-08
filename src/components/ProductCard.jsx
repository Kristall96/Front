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
    <div className="bg-[#1f2937] rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
      {/* Product Image */}
      <Link to={`/product/${slug}`} className="block">
        <img
          src={imageUrl || "/placeholder.jpg"}
          alt={title}
          className="w-full h-56 object-cover rounded-t-xl"
          loading="lazy"
        />
      </Link>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-semibold text-white truncate hover:text-blue-500 transition duration-300">
          {title}
        </h3>

        {/* Price and Discount */}
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium text-gray-200">
            €{finalPrice?.toFixed(2)}{" "}
            {discountPercentage > 0 && (
              <span className="text-sm text-red-400">
                ({discountPercentage}% OFF)
              </span>
            )}
          </p>
        </div>

        {/* Category and Brand */}
        <p className="text-sm text-gray-400">
          {category?.name || "No Category"}
        </p>
        <p className="text-sm text-gray-400">{brand?.name || "No Brand"}</p>

        {/* Product Status */}
        <div className="flex gap-2 mt-2 text-xs">
          {isPublished && (
            <span className="px-2 py-0.5 rounded-full bg-green-500 text-white">
              Published
            </span>
          )}
          {isFeatured && (
            <span className="px-2 py-0.5 rounded-full bg-yellow-500 text-black">
              Featured
            </span>
          )}
          {!isPublished && !isFeatured && (
            <span className="px-2 py-0.5 rounded-full bg-gray-500 text-white">
              Draft
            </span>
          )}
        </div>

        {/* Variants and Stock */}
        <div className="text-sm text-gray-400">
          {variants?.length || 0} variant{variants?.length !== 1 ? "s" : ""} |{" "}
          {stock ?? 0} in stock
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Link
            to={`/product/${slug}`}
            className="w-1/3 text-center bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-200"
          >
            View
          </Link>

          <button
            className="w-1/3 text-center bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 hover:shadow-lg transition duration-200"
            disabled
          >
            Edit
          </button>

          <button
            onClick={() => onDelete && onDelete(_id)}
            className={`w-1/3 text-center bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition duration-200 ${
              source === "printful" ? "bg-gray-300 cursor-not-allowed" : ""
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
