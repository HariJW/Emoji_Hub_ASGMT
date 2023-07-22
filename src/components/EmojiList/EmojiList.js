import React, { useEffect, useState } from "react";
import "./emojilist.css";

const EmojiHubAPI = "https://emojihub.yurace.pro/api/all";

function EmojiList() {
  const [emojis, setEmojis] = useState([]);
  const [filteredEmojis, setFilteredEmojis] = useState([]);
  const [categories, setCategories] = useState([
    "smileys and people",
    "animals and nature",
    "food and drink",
    "travel and places",
    "activities",
    "objects",
    "symbols",
    "flags",
  ]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const emojisPerPage = 10;

  useEffect(() => {
    fetchEmojis();
  }, []);

  const fetchEmojis = async () => {
    try {
      const response = await fetch(EmojiHubAPI);
      const data = await response.json();
      setEmojis(data);
      setFilteredEmojis(data);
    } catch (error) {
      console.error("Error fetching emojis:", error);
    }
  };

  const handleCategoryFilter = (event) => {
    const selectedCategory = event.target.value;
    setCategoryFilter(selectedCategory);
    filterEmojis(selectedCategory);
  };

  const filterEmojis = (category) => {
    if (category === "") {
      setFilteredEmojis(emojis);
    } else {
      const filtered = emojis.filter((emoji) => emoji.category === category);
      setFilteredEmojis(filtered);
    }
    setCurrentPage(1);
  };

  const renderEmojiCards = () => {
    const indexOfLastEmoji = currentPage * emojisPerPage;
    const indexOfFirstEmoji = indexOfLastEmoji - emojisPerPage;
    const currentEmojis = filteredEmojis.slice(
      indexOfFirstEmoji,
      indexOfLastEmoji
    );

    return currentEmojis.map((emoji) => (
      <div className="outer-emoji-card">
        <div key={emoji.name} className="emoji-card">
          <p className="emoji" dangerouslySetInnerHTML={{ __html: emoji.htmlCode }}></p>
          <div className="emoji-details">
            <div className="detail-field"><p className="field-tag">Name :</p> <div className="field-val">{emoji.name}</div></div>
            <div className="detail-field"><p className="field-tag">Category : </p><div className="field-val">{emoji.category}</div></div>
            <div className="detail-field"><p className="field-tag">Group : </p><div className="field-val">{emoji.group}</div></div>
          </div>
        </div>
      </div>
    ));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(filteredEmojis.length / emojisPerPage);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage));
  };

  return (
    <div className="emojiapp">
      <h1>Emoji Hub</h1>

      <div className="filter">
        <label className="filter-lable" htmlFor="category-filter">Filter by Category:</label>
        <select
          id="category-filter"
          value={categoryFilter}
          onChange={handleCategoryFilter}
        >
          <option value="">All</option>

          {categories.map((cat) => (
            <option value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="emoji-list">{renderEmojiCards()}</div>

      <div className="pagination">
        <button
          className="btn"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="btn"
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(filteredEmojis.length / emojisPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default EmojiList;
