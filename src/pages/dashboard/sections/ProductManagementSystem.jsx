import { useState } from "react";
import ProductList from "./ProductManagement/ProductList";
import CategoryManager from "./ProductManagement/CategoryManager";
import BrandManager from "./ProductManagement/BrandManager";
import VariantManager from "./ProductManagement/VariantManager";

const ProductManagementSystem = () => {
  const [activeView, setActiveView] = useState("products");

  const navItems = [
    { key: "products", label: "Products" },
    { key: "categories", label: "Categories" },
    { key: "brands", label: "Brands" },
    { key: "variants", label: "Variants" },
  ];

  return (
    <div>
      <div className="flex gap-4 mb-6">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveView(item.key)}
            className={`px-4 py-2 rounded ${
              activeView === item.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded shadow p-4">
        {activeView === "products" && <ProductList />}
        {activeView === "categories" && <CategoryManager />}
        {activeView === "brands" && <BrandManager />}
        {activeView === "variants" && <VariantManager />}
      </div>
    </div>
  );
};

export default ProductManagementSystem;
