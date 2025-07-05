import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "../components/HomePage";
import ArticlePage from "../components/ArticlePage";
import TopicList from "../components/TopicList";
import TopicPage from "../components/TopicPage";
import NotFound from "../components/NotFound"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles/:article_id" element={<ArticlePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/articles/:article_id" element={<ArticlePage />} />
          <Route path="/topics/:topic" element={<TopicPage />} />
          <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
