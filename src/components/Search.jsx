// ✅ Updated `search.jsx` with dark neon theme
import React, { useState } from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {

  return (
    <div className="search-container group mb-6 animate-slide-up">
      <div className="relative w-full flex items-center">
        <img
          src="/search.svg"
          alt="Search"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-80 pointer-events-none z-10"
        />
        <input
          className="input-modern w-full pl-12 shadow-glow placeholder-white relative"
          type="text"
          placeholder="Search for a book..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );

};

export default Search;
