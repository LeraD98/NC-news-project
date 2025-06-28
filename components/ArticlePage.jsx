import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ArticlePage() {
  const { article_id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [voteChange, setVoteChange] = useState(0);
  const [voteError, setVoteError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState(null);
  const [deletingCommentIds, setDeletingCommentIds] = useState([]);
  const loggedInUser = "grumpy19";

  useEffect(() => {
    fetch(`http://localhost:9090/api/articles/${article_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Article not found");
        }
        return res.json();
      })
      .then((data) => {
        setArticle(data.article);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [article_id]);

  useEffect(() => {
    fetch(`http://localhost:9090/api/articles/${article_id}/comments`)
      .then((res) => {
        if (!res.ok) throw new Error("Comments not found");
        return res.json();
      })
      .then((data) => {
        setComments(data.comments);
      })
      .catch((err) => {
        console.error("Failed to fetch comments:", err);
      });
  }, [article_id]);

  const handleVote = (change) => {
    setVoteChange((prev) => prev + change);
    setVoteError(null);

    fetch(`http://localhost:9090/api/articles/${article_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inc_votes: change }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update votes");
        }
        return res.json();
      })
      .catch(() => {
        setVoteChange((prev) => prev - change);
        setVoteError("Failed to register vote. Please try again.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setPosting(true);
    setPostError(null);

    fetch(`http://localhost:9090/api/articles/${article_id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "grumpy19",
        body: newComment,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to post comment");
        return res.json();
      })
      .then((data) => {
        setComments((prev) => [data.comment, ...prev]);
        setNewComment("");
      })
      .catch(() => {
        setPostError("Something went wrong, try again.");
      })
      .finally(() => {
        setPosting(false);
      });
  };

  const handleDelete = (comment_id) => {
    setDeletingCommentIds((prev) => [...prev, comment_id]);

    fetch(`http://localhost:9090/api/comments/${comment_id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete comment");
        setComments((prev) => prev.filter((c) => c.comment_id !== comment_id));
      })
      .catch(() => {
        alert("Error deleting comment. Please try again.");
      })
      .finally(() => {
        setDeletingCommentIds((prev) => prev.filter((id) => id !== comment_id));
      });
  };

  if (isLoading) return <p>Loading article...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <article className="max-w-3xl mx-auto bg-gray-800 p-6 rounded shadow-lg">
        <h2 className="text-3xl font-bold text-pink-300 mb-2">
          {article.title}
        </h2>
        <p className="text-sm text-pink-200 mb-4">
          By <span className="font-medium">{article.author}</span> • Topic:{" "}
          <span className="italic">{article.topic}</span>
        </p>
        <p className="mb-4 text-gray-300">{article.body}</p>
        <div className="flex items-center gap-4 mt-4">
          <p className="text-pink-300">Votes: {article.votes + voteChange}</p>
          <button
            onClick={() => handleVote(1)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          >
            + Upvote
          </button>
          <button
            onClick={() => handleVote(-1)}
            className="bg-pink-700 hover:bg-pink-800 text-white px-3 py-1 rounded"
          >
            - Downvote
          </button>
        </div>
        {voteError && <p className="text-red-400 mt-2">{voteError}</p>}
      </article>

      <form onSubmit={handleSubmit} className="mt-6 max-w-3xl mx-auto">
        <label className="block mb-2 text-pink-200 text-lg font-medium">
          Add a Comment:
        </label>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
          rows="4"
          placeholder="Write your comment here..."
          disabled={posting}
        />
        <button
          type="submit"
          disabled={posting || !newComment.trim()}
          className="mt-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded text-white disabled:opacity-50"
        >
          {posting ? "Posting..." : "Post Comment"}
        </button>
        {postError && <p className="text-red-400 mt-2">{postError}</p>}
      </form>

      <section className="mt-10 max-w-3xl mx-auto">
        <h3 className="text-2xl font-semibold text-pink-400 mb-4">Comments</h3>
        {comments.length === 0 ? (
          <p className="text-gray-400">No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.comment_id}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              >
                <p className="text-sm text-gray-400 mb-1">
                  <span className="font-semibold text-pink-300">
                    {comment.author}
                  </span>
                  &nbsp;•&nbsp; {new Date(comment.created_at).toLocaleString()}
                </p>
                <p className="text-gray-200">{comment.body}</p>
                {comment.author === loggedInUser && (
                  <button
                    onClick={() => handleDelete(comment.comment_id)}
                    disabled={deletingCommentIds.includes(comment.comment_id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    {deletingCommentIds.includes(comment.comment_id)
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ArticlePage;
