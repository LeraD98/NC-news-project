import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const TopicPage = () => {
  const { topic } = useParams();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:9090/api/articles?topic=${topic}`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [topic]);

  if (isLoading) return <p className="text-white p-6">Loading articles...</p>;

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold text-pink-300 mb-6">
        Articles in "{topic}"
      </h2>
      {articles.length === 0 ? (
        <p>No articles found for this topic.</p>
      ) : (
        articles.map((article) => (
          <div key={article.article_id} className="mb-4">
            <h3 className="text-xl font-semibold">
              <Link
                to={`/articles/${article.article_id}`}
                className="text-pink-400 hover:underline"
              >
                {article.title}
              </Link>
            </h3>
            <p className="text-sm text-gray-300">
              By {article.author} | Votes: {article.votes}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default TopicPage;
