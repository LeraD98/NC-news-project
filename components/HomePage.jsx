import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArticlePage from "./ArticlePage";

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://backend-project-e32q.onrender.com/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading articles...</p>;

  return (
 <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <h1 className="text-4xl font-bold mb-10 text-lilac-500">NC News</h1>

      <div className="space-y-5">
        {articles.map((article) => (
          <div
            key={article.article_id}
            className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition"
          >
            <h3 className="text-2xl font-semibold text-lilac-400 mb-2">
              <Link to={`/articles/${article.article_id}`}>{article.title}</Link>
            </h3>
            <p className="text-gray-300">
              By <span className=" font-semibold">{article.author}</span> 
              <span className="text-lilac-400">{article.votes} votes</span> 
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
