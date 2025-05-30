const ToggleOptions = ({ form, setForm }) => (
  <div className="flex gap-6 pt-2">
    <label className="flex items-center gap-2 text-gray-200">
      <input
        type="checkbox"
        checked={form.isPublished}
        onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
      />
      <span>Published</span>
    </label>
    <label className="flex items-center gap-2 text-gray-200">
      <input
        type="checkbox"
        checked={form.isFeatured}
        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
      />
      <span>Featured</span>
    </label>
  </div>
);

export default ToggleOptions;
