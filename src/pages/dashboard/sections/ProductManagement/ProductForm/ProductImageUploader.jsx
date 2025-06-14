export const ProductImageUploader = ({
  form,
  setForm,
  uploading,
  handleImageUpload,
}) => (
  <div>
    <Label>Upload Images</Label>
    <div className="relative w-fit">
      <input
        type="file"
        id="fileUpload"
        multiple
        className="hidden"
        onChange={handleImageUpload}
      />
      <label
        htmlFor="fileUpload"
        className="cursor-pointer px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white inline-block"
      >
        📁 Browse Files
      </label>
    </div>
    {uploading && <p className="text-sm text-gray-400 mt-1">Uploading...</p>}

    <div className="flex gap-2 flex-wrap mt-3">
      {form.images.map((img) => (
        <div key={img} className="relative border rounded shadow-sm">
          <img src={img} className="w-24 h-24 object-cover rounded" />
          <button
            type="button"
            className={`absolute top-1 right-1 text-xs px-2 py-1 rounded-full ${
              form.thumbnail === img ? "bg-green-600" : "bg-gray-600"
            } text-white`}
            onClick={() => setForm({ ...form, thumbnail: img })}
          >
            {form.thumbnail === img ? "✓" : "Set"}
          </button>
          <button
            type="button"
            onClick={() => {
              const filtered = form.images.filter((f) => f !== img);
              setForm({
                ...form,
                images: filtered,
                thumbnail:
                  form.thumbnail === img ? filtered[0] || "" : form.thumbnail,
              });
            }}
            className="absolute bottom-1 right-1 text-xs bg-red-500 text-white px-1 rounded"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>
);
