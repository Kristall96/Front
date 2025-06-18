// admin/components/blocks/ImageBlock.jsx
export default function ImageBlock({ block, onChange, onDelete }) {
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/uploads/variant-preview", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.uploaded) {
        onChange({ url: data.uploaded, alt: file.name });
      } else {
        alert("Image upload failed");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Something went wrong while uploading.");
    }
  };

  return (
    <div className="relative group border rounded p-4 bg-gray-50">
      {block.content?.url ? (
        <div className="flex flex-col gap-2">
          <img
            src={block.content.url}
            alt={block.content.alt || "Uploaded image"}
            className="max-w-full rounded shadow"
          />
          <input
            type="text"
            className="w-full border p-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={block.content.alt}
            onChange={(e) =>
              onChange({ ...block.content, alt: e.target.value })
            }
            placeholder="Image alt text"
          />
        </div>
      ) : (
        <label className="block border-2 border-dashed border-gray-300 p-4 text-center text-gray-500 rounded cursor-pointer hover:bg-gray-100">
          Click to upload an image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

      <button
        type="button"
        onClick={onDelete}
        title="Delete image block"
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 hidden group-hover:block"
      >
        ✕
      </button>
    </div>
  );
}
