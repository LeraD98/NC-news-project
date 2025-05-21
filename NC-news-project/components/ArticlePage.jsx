import React, { useState, useEffect} from "react";

function ArticlePage() {
  const { article_id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (isLoading) return <p>Loading article...</p>;
  if (error) return <p>{error}</p>;

  return (
    <article>
      <h2>{article.title}</h2>
      <p><strong>By:</strong> {article.author}</p>
      <p><strong>Topic:</strong> {article.topic}</p>
      <p><strong>Posted:</strong> {new Date(article.created_at).toLocaleString()}</p>
      <p>{article.body}</p>
      <p><strong>Votes:</strong> {article.votes}</p>
    </article>
  );
}

export default ArticlePage;