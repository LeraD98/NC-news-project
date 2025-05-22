import React, { useState, useEffect} from "react";
import { useParams } from "react-router-dom";

function ArticlePage() {
  const { article_id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);


  useEffect(() => {
    fetch(`https://backend-project-e32q.onrender.com/api/articles/${article_id}`)
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
  fetch(`https://backend-project-e32q.onrender.com/api/articles/${article_id}/comments`)
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

  if (isLoading) return <p>Loading article...</p>;
  if (error) return <p>{error}</p>;

  return (
    <><article>
      <h2>{article.title}</h2>
      <p><strong>By:</strong> {article.author}</p>
      <p><strong>Topic:</strong> {article.topic}</p>
      <p><strong>Posted:</strong> {new Date(article.created_at).toLocaleString()}</p>
      <p>{article.body}</p>
      <p><strong>Votes:</strong> {article.votes}</p>
    </article>
    
    <section className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Comments</h3>
        {comments.length === 0 ? (
          <p className="text-gray-600">No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.comment_id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <p className="text-sm text-gray-500 mb-1">
                  <span className="font-semibold text-gray-700">{comment.author}</span>
                  &nbsp;•&nbsp; {new Date(comment.created_at).toLocaleString()}
                </p>
                <p className="text-gray-800">{comment.body}</p>
              </div>
            ))}
          </div>
        )}
      </section></>

  );
}

export default ArticlePage;