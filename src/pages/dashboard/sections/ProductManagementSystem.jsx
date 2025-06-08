import { useState } from "react";
import ProductList from "./ProductManagement/ProductList";
import CategoryManager from "./ProductManagement/CategoryManager";
import BrandManager from "./ProductManagement/BrandManager";
import VariantManager from "./ProductManagement/VariantManager";

const ProductManagementSystem = () => {
  const [activeView, setActiveView] = useState("products");

  const navItems = [
    { key: "products", label: "🛒 Products" },
    { key: "categories", label: "📂 Categories" },
    { key: "brands", label: "🏷 Brands" },
    { key: "variants", label: "🎨 Variants" },
  ];

  const titles = {
    products: "All Products",
    categories: "Manage Categories",
    brands: "Manage Brands",
    variants: "Manage Variants",
  };

  return (
    <section>
      {/* Dynamic Title */}
      <h1 className="text-2xl font-bold text-gray-700 dark:text-white mb-6">
        {titles[activeView]}
      </h1>

      {/* Navigation Tabs */}
      <nav
        className="flex flex-wrap gap-2 mb-4"
        role="tablist"
        aria-label="Product Management Tabs"
      >
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveView(item.key)}
            className={`px-4 py-2 rounded-md font-medium transition-all
              ${
                activeView === item.key
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            role="tab"
            aria-selected={activeView === item.key}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Content View */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border dark:border-gray-700">
        {activeView === "products" && <ProductList />}
        {activeView === "categories" && <CategoryManager />}
        {activeView === "brands" && <BrandManager />}
        {activeView === "variants" && <VariantManager />}
      </div>
    </section>
  );
};

export default ProductManagementSystem;
