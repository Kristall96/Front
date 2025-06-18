import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { blocksToHTML } from "@/utils/blocksToHTML";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((res) => res.json())
      .then((data) => setPost(data.post));
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetch(`/api/blog/${slug}/view`, { method: "POST" });
    }
  }, [slug]);

  const handleLike = () => {
    fetch(`/api/blog/${slug}/like`, { method: "POST" })
      .then(() => alert("❤️ Thanks for liking!"))
      .catch(() => alert("Failed to like post."));
  };

  const handleShare = (platform) => {
    fetch(`/api/blog/${slug}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform }),
    }).catch(() => {});
  };

  if (!post) {
    return (
      <div className="p-8 flex justify-center items-center text-gray-500 text-lg">
        Loading post...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-md mt-6 p-8">
      <h1 className="text-4xl font-bold mb-3 text-gray-800">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        By <span className="font-medium">{post.author.displayName}</span> •{" "}
        {new Date(post.publishedAt).toLocaleDateString()}
      </p>

      {/* Metrics */}
      <div className="flex items-center gap-6 mb-6 text-sm text-gray-600 border-b pb-4">
        <span>
          👁️ <strong>{post.views}</strong> views
        </span>
        <span>
          ❤️ <strong>{post.likes}</strong> likes
        </span>
        <span>
          🔗 <strong>{post.shares?.twitter || 0}</strong> shares
        </span>
      </div>

      {/* Rendered Content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blocksToHTML(post.blocks) }}
      />

      {/* Interaction Buttons */}
      <div className="mt-10 flex gap-4">
        <button
          onClick={handleLike}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          ❤️ Like Post
        </button>
        <a
          href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare("twitter")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          🐦 Share on Twitter
        </a>
      </div>
    </div>
  );
}
