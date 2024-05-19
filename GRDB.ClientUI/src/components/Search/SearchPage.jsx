import React from 'react';
import { useLocation } from 'react-router-dom'; // To access URL parameters

const SearchPage = () => {
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get('q');

  // Simulate fetching search results based on searchTerm
  const [searchResults, setSearchResults] = useState([]);

  // Replace this with actual search logic (e.g., API calls)
  React.useEffect(() => {
    if (searchTerm) {
      const fakeSearchResults = ['Result 1', 'Result 2', 'Result 3'];
      setSearchResults(fakeSearchResults);
    }
  }, [searchTerm]);

  return (
    <div className="search-page">
      <h2>Search Results for: "{searchTerm}"</h2>
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((result) => (
            <li key={result}>{result}</li>
          ))}
        </ul>
      ) : (
        <p>No results found for "{searchTerm}".</p>
      )}
    </div>
  );
};

export default SearchPage;
