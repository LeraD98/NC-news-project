import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TopicsList = () => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetch("https://backend-project-e32q.onrender.com/api/topics")
      .then((res) => res.json())
      .then((data) => setTopics(data.topics));
  }, []);

  return (
    <div className="text-white p-6">
      <h2 className="text-2xl font-bold mb-4">Choose a Topic</h2>
      <ul className="space-y-2">
        {topics.map((topic) => (
          <li key={topic.slug}>
            <Link
              to={`/topics/${topic.slug}`}
              className="text-purple-400 hover:underline"
            >
              {topic.slug}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicsList;