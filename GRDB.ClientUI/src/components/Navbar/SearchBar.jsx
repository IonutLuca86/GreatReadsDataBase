import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './SearchBar.css'
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    if (searchTerm) {
      navigate(`/search?q=${searchTerm}`); 
    }
  };

  return (
    <div className='searchbar-container'> 
    <form className="searchbar-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className='searchbar-input'
          />
          <button type="submit" className='searchbar-button'><FaSearch size={20}/></button>
    </form>
    </div>
    
  );
};

export default SearchBar;
