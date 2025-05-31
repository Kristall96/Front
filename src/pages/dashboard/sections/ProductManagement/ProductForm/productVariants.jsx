import { Label } from "./ProductFormLabel";

export const ProductVariantForm = ({ form, setForm, variantCategories }) => (
  <div>
    <Label>Variants</Label>
    {form.variants.map((v, i) => (
      <div
        key={i}
        className="flex gap-3 items-start md:items-end mb-4 flex-wrap md:flex-nowrap"
      >
        <div className="flex-1">
          <Label className="text-xs">Category</Label>
          <select
            className="input"
            value={v.variantCategory?._id || v.variantCategory || ""}
            onChange={(e) => {
              const selected = variantCategories.find(
                (vc) => vc._id === e.target.value
              );
              const updated = [...form.variants];
              updated[i].variantCategory = selected;
              setForm({ ...form, variants: updated });
            }}
          >
            <option value="">Select Category</option>
            {variantCategories.map((vc) => (
              <option key={vc._id} value={vc._id}>
                {vc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <Label className="text-xs">Value</Label>
          <input
            type="text"
            className="input"
            placeholder="e.g. Red, XL"
            value={v.value}
            onChange={(e) => {
              const updated = [...form.variants];
              updated[i].value = e.target.value;
              setForm({ ...form, variants: updated });
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            const updated = [...form.variants];
            updated.splice(i, 1);
            setForm({ ...form, variants: updated });
          }}
          className="h-9 mt-6 px-3 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
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
      className="mt-2 inline-block px-4 py-2 rounded border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition"
    >
      + Add Variant
    </button>
  </div>
);
