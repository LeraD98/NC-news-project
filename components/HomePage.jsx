import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArticlePage from "./ArticlePage";

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("created_at"); 
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    fetch("https://backend-project-e32q.onrender.com/api/topics")
      .then((res) => res.json())
      .then((data) => setTopics(data.topics));
  }, []);

  // Fetch articles (filtered if topic is selected)
  useEffect(() => {
    setIsLoading(true);
  let url = "https://backend-project-e32q.onrender.com/api/articles";
  const params = new URLSearchParams();

  if (selectedTopic) params.append("topic", selectedTopic);
  if (sortBy) params.append("sort_by", sortBy);
  if (order) params.append("order", order);

  url += `?${params.toString()}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      setArticles(data.articles);
      setIsLoading(false);
    });
  }, [selectedTopic, sortBy, order]);


  if (isLoading) return <p>Loading articles...</p>;

  return (
   <div className="text-white p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-pink-500">NC News</h1>

      {/* Topic Filter */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-purple-300 mb-3">Filter by Topic:</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedTopic("")}
            className={`px-3 py-1 rounded ${
              selectedTopic === "" ? "bg-purple-700" : "bg-gray-700"
            } hover:bg-purple-800`}
          >
            All
          </button>
          {topics.map((topic) => (
            <button
              key={topic.slug}
              onClick={() => setSelectedTopic(topic.slug)}
              className={`px-3 py-1 rounded ${
                selectedTopic === topic.slug ? "bg-pink-700" : "bg-gray-700"
              } hover:bg-pink-800`}
            >
              {topic.slug}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
  <label className="text-white">
    Sort by:{" "}
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="bg-gray-800 text-white p-1 rounded"
    >
      <option value="created_at">Date</option>
      <option value="votes">Votes</option>
      <option value="comment_count">Comments</option>
    </select>
  </label>

  <button
    onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
    className="bg-purple-600 text-white px-3 py-1 rounded"
  >
    {order === "asc" ? "Ascending" : "Descending"}
  </button>
</div>

      {/* Articles */}
      <div className="space-y-5">
        {articles.map((article) => (
          <div
            key={article.article_id}
            className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition"
          >
            <img
  src={article.article_img_url}
  alt={`Image for ${article.title}`}
  className="w-full max-h-64 object-cover rounded-lg mb-4"
/>
            <h3 className="text-2xl font-semibold text-pink-400 mb-2">
              <Link to={`/articles/${article.article_id}`}>
                {article.title}
              </Link>
            </h3>
            <p className="text-gray-300">
              By <span className="font-semibold">{article.author}</span> •{" "}
              Topic:{" "}
              <span className="italic text-purple-400">{article.topic}</span>{" "}
              • {article.votes} votes
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
