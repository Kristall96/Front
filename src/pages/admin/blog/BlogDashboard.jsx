import { useNavigate } from "react-router-dom";

const BlogDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          📚 Blog Posts
        </h2>
        <button
          onClick={() => navigate("/dashboard/admin?tab=blog-editor")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          ➕ New Post
        </button>
      </div>

      <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded bg-gray-50 text-gray-500">
        📝 No blog posts yet. <br />
        <span className="text-sm">
          Click “New Post” to create your first article.
        </span>
      </div>
    </div>
  );
};

export default BlogDashboard;
