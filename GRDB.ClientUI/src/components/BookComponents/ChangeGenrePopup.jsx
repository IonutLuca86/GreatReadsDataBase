import { useState,useEffect } from "react";
import getAllGenres from "../Functions/GetAllGenres";



export default function ChangeGenrePopup({isOpen, onClose,existingGenres,replaceGenres,addToExisting}){

    const [allGenres,setAllGenres] = useState();
    const [filteredGenres,setFilteredGenres] = useState([]);
    const [selectedGenres,setSelectedGenres] = useState([]);
    const [searchTerm,setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {   
                const genres = await getAllGenres();
                console.log(genres)
                setAllGenres([...genres]);  
                setFilteredGenres(genres);            
            } catch (error) {
                console.error('Error fetching genres :', error);
            }
        };    
        fetchData();
    },[]);

    console.log(allGenres)
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        const filtered = allGenres.filter((genre) =>
          genre.name?.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredGenres(filtered);
      };

      const handleExistingGenreClick = (genre) => {
        setSelectedGenres([...selectedGenres, genre]);
        setFilteredGenres([]); 
        setSearchTerm('');
        };

    const handleCancelClick = () => {
        onClose();
      };

      const handleReplaceGenreClick = () => {       
        replaceGenres(selectedGenres);
        onClose(); 
      };
    
      const handleAddGenreClick = () => {
        addToExisting(selectedGenres);        
        onClose(); 
      };

    return(
        <>
        <div className={`author-selection-popup ${isOpen ? 'active' : ''}`}>
            <div className='popup-content'>
            <h2>Select a category to replace or add to the existing one:</h2>
            <div className="existing-author-wrapper">
            <label htmlFor="existing-author">Category:</label>
            <input
              type="text"
              value={selectedGenres.map(genre => genre.name).join(', ')}
              readOnly
              id="existing-author"
              className="existing-author-input"       
            />         
          </div> 
          <div className="existing-author-wrapper">
            <p className='existing-author'>Initial Category(es): {existingGenres.join(',')}</p>
          </div>      
          <div className="search-wrapper">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search authors..."
              className="search-input"
            />
               {searchTerm && filteredGenres.length >0 &&(
            <div className="genre-list">
            {filteredGenres.map((genre) => (
              <div className="author-item" key={genre.id} onClick={() => handleExistingGenreClick(genre)}>
                <span>{genre.name}</span>
              </div>
            ))}
          </div>
          )}
          </div>       
            
          <div className="button-wrapper">
            <button type="button" onClick={handleCancelClick}>
              Cancel
            </button>
          
              <div>
                   <button className='cp-button' onClick={handleReplaceGenreClick}>Replace</button>
            <button className='cp-button' onClick={handleAddGenreClick}>Add to existent</button>
              </div>
    
          </div>
            </div>
           
        </div>
        </>
    )

}