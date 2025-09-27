import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
  useParams,
} from "react-router-dom";
import { ClipLoader } from "react-spinners";

import "./App.css";

const links = [
  "General",
  "World",
  "Nation",
  "Business",
  "Technology",
  "Entertainment",
  "Sports",
  "Health",
];

// 🔹 Navigacija
const NavBar = ({ category, setCategory }) => {
  return (
    <div className="navbar-container">
      <div className="navbar-heading">
        <h3>News Feed</h3>
      </div>
      <div className="navbar-links">
        <ul>
          {links.map((link) => (
            <li key={link}>
              <NavLink
                to={`/category/${link.toLowerCase()}`}
                onClick={() => setCategory(link.toLowerCase())}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                {link}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// 🔹 Kartica članka
const Card = ({ article, title }) => {
  return (
    <Link to={`/article/${title}`} className="card-link">
      <div className="card">
        <div className="news-image">
          <img src={article.image} alt={article.title} />
          <div className="news-gradient">
            <div className="news-text">
              <h3>{article.title}</h3>
              <p>{article.source.name}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// 🔹 Stranica sa listom članaka
const HomePage = ({ articles, loading }) => {
  return (
    <div className="container">
      {loading && (
        <ClipLoader
          color={"#ffffff"}
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}

      {!loading && articles.length === 0 && <h2>No articles found</h2>}

      {!loading && articles.length > 0 && (
        <div className="cards-container">
          {articles.map((article, index) => (
            <Card key={index} article={article} title={article.title} />
          ))}
        </div>
      )}
    </div>
  );
};

// 🔹 Stranica za detalje članka
const ArticlePage = ({ articles }) => {
  const { title } = useParams();
  const article = articles.find((art) => art.title === title);

  if (!article) {
    return <h2>Article not found</h2>;
  }

  return (
    <div className="article-page">
      <h2>{article.title}</h2>
      <p>Publish at: {article.publishedAt.toString().split("-").join("/").slice(0, 10)}</p>
      <img src={article.image} alt={article.title} />
      <p><strong>Source:</strong> {article.source.name}</p>
      <p>{article.description}</p>
      <a href={article.url} target="_blank" rel="noreferrer">
        Read full article
      </a>
    </div>
  );
};

// 🔹 Glavna App komponenta
function App() {
  const API_KEY = "3df562e821d81e3fbfa30887341170fe";

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(links[0].toLowerCase());

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&apikey=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setArticles(data.articles || []);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching the news:", error))
      .finally(() => {
        setLoading(false);
      });
  }, [category]);

  return (
    <Router>
      <NavBar category={category} setCategory={setCategory} />

      <Routes>
        {/* Početna i kategorije */}
        <Route
          path="/"
          element={<HomePage articles={articles} loading={loading} />}
        />
        <Route
          path="/category/:name"
          element={<HomePage articles={articles} loading={loading} />}
        />

        {/* Detaljna stranica članka */}
        <Route
          path="/article/:title"
          element={<ArticlePage articles={articles} />}
        />
      </Routes>
    </Router>
  );
}

export default App;