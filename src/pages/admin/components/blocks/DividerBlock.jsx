export default function DividerBlock({ readOnly = false }) {
  if (readOnly) {
    // 👁️ Preview mode – clean divider
    return (
      <div className="my-8">
        <hr className="border-t-2 border-gray-300" />
      </div>
    );
  }

  // 📝 Edit mode – clean divider with spacing
  return (
    <div className="my-8">
      <hr className="border-t-2 border-gray-300" />
    </div>
  );
}
