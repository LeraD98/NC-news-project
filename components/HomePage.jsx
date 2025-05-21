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
    <div>
      <h1>Welcome to NC News</h1>
      {articles.map((article) => (
        <div key={article.article_id}>
          <h3 className="font-bold text-lg">
            <Link to={`/articles/${article.article_id}`}>{article.title}</Link>
          </h3>
          <p className=" mb-4">
            By {article.author} | Votes: {article.votes} | Comments:{" "}
            {article.comment_count}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
