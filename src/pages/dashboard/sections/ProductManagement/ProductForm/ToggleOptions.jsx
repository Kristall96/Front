const ToggleOptions = ({ form, setForm }) => (
  <div className="flex flex-wrap gap-6 pt-2">
    {/* Published Toggle */}
    <label
      htmlFor="isPublished"
      className="flex items-center gap-2 text-gray-200 cursor-pointer"
    >
      <input
        id="isPublished"
        type="checkbox"
        className="accent-indigo-500 w-4 h-4"
        checked={form.isPublished}
        onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
      />
      <span>Published</span>
    </label>

    {/* Featured Toggle */}
    <label
      htmlFor="isFeatured"
      className="flex items-center gap-2 text-gray-200 cursor-pointer"
    >
      <input
        id="isFeatured"
        type="checkbox"
        className="accent-indigo-500 w-4 h-4"
        checked={form.isFeatured}
        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
      />
      <span>Featured</span>
    </label>
  </div>
);

export default ToggleOptions;
