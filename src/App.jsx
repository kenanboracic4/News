import { useState, useEffect } from "react";
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
const NavBar = ({category, setCategory}) => {


  return (
    <div className="navbar-container">
      <div className="navbar-heading">
        <h3>News Feed</h3>
      </div>
      <div className="navbar-links">
        <ul>
          {links.map((link) => (
            <li key={link}>
              <a 
              onClick={()=> setCategory(link.toLowerCase())}
              href="#">{link}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Card = ({article}) => {
  return(
    <>
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
    </>
  )
}

function App() {
  const API_KEY = "3df562e821d81e3fbfa30887341170fe"

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState(links[0].toLowerCase())




  useEffect(() => {
    setLoading(true);
  fetch(`https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&apikey=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    setArticles(data.articles);
    
    console.log(data);
  })
  .catch(error => console.error('Error fetching the news:', error))
  .finally(() => {
    setLoading(false);
  });

  }, [category]);

  console.log(category)

  return <>
<NavBar category={category} setCategory={setCategory} /> 

<div className="container">
{loading && <ClipLoader
      
        color={"#ffffff"}
        loading={loading}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />}
{!loading && articles.length === 0 && <h2>No articles found</h2>}
{!loading && articles.length > 0 && 
  <div className="cards-container">
    {articles.map((article, index) => (
      <Card key={index} article={article} />
    ))}
  </div>
}
</div>
  </>;
}

export default App;
