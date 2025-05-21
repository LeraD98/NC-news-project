import { Routes, Route } from "react-router-dom";
import HomePage from "../components/HomePage";
import ArticlePage from "../components/ArticlePage";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles/:article_id" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
