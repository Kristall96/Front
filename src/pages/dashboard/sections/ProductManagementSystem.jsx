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

  return (
    <section>
      <h1 className="text-2xl font-bold text-gray-400 dark:text-white mb-6">
        All Products
      </h1>

      {/* Nav Tabs */}
      <nav
        className="flex flex-wrap gap-2 mb-4"
        role="tablist"
        aria-label="Product management sections"
      >
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveView(item.key)}
            className={`px-4 py-2 rounded-md transition font-medium ${
              activeView === item.key
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            }`}
            role="tab"
            aria-selected={activeView === item.key}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Dynamic View */}
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
