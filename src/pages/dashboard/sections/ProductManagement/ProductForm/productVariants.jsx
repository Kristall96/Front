import React from "react";
import Label from "./label.jsx";

const ProductVariants = ({ form, setForm, variantCategories, renderError }) => {
  const updateVariant = (index, field, value) => {
    const updated = [...form.variants];
    updated[index][field] = value;
    setForm({ ...form, variants: updated });
  };

  const removeVariant = (index) => {
    const updated = [...form.variants];
    updated.splice(index, 1);
    setForm({ ...form, variants: updated });
  };

  return (
    <div>
      <Label>Variants</Label>

      {form.variants.map((v, i) => (
        <div
          key={i}
          className="flex gap-3 items-start md:items-end mb-4 flex-wrap md:flex-nowrap"
        >
          <div className="flex-1">
            <Label htmlFor={`variantCategory-${i}`} className="text-xs">
              Category
            </Label>
            <select
              id={`variantCategory-${i}`}
              className="w-full px-2 py-1 rounded bg-gray-800 text-white border border-gray-600"
              value={v.variantCategory?._id || v.variantCategory || ""}
              onChange={(e) => {
                const selected = variantCategories.find(
                  (vc) => vc._id === e.target.value
                );
                updateVariant(i, "variantCategory", selected || "");
              }}
            >
              <option value="">Select Category</option>
              {variantCategories.map((vc) => (
                <option key={vc._id} value={vc._id}>
                  {vc.name}
                </option>
              ))}
            </select>
            {renderError && renderError(`variants.${i}.variantCategory`)}
          </div>

          <div className="flex-1">
            <Label htmlFor={`variantValue-${i}`} className="text-xs">
              Value
            </Label>
            <input
              id={`variantValue-${i}`}
              type="text"
              className="w-full px-2 py-1 rounded bg-gray-800 text-white border border-gray-600"
              value={v.value}
              onChange={(e) => updateVariant(i, "value", e.target.value)}
            />
            {renderError && renderError(`variants.${i}.value`)}
          </div>

          <button
            type="button"
            className="h-9 mt-6 px-3 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
            onClick={() => removeVariant(i)}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setForm({
            ...form,
            variants: [...form.variants, { variantCategory: "", value: "" }],
          })
        }
        className="mt-2 px-4 py-2 rounded border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
      >
        + Add Variant
      </button>
    </div>
  );
};

export default ProductVariants;
