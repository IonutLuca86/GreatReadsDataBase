import { useState,useEffect,useRef } from 'react';
import getUserInfo from '../Functions/GetUserInfo';
import getAllAuthors from '../Functions/GetAllAuthors';
import getAllGenres from '../Functions/GetAllGenres';
import LoadImagePopup from '../BookComponents/LoadImagePopup';
import './EditPage.css'
import AddNewAuthorPopup from '../BookComponents/AddNewAuthorPopup';
import addNewAuthor from '../Functions/AddNewAuthor';
import tokenValidation from '../Functions/TokenValidation';
import { useNavigate } from 'react-router-dom';
import { IoArrowUndoCircleOutline } from "react-icons/io5";
import addNewBook from '../Functions/AddNewBook';
import addAuthorConnection from '../Functions/AddAuthorConnection';
import addGenreConnection from '../Functions/AddGenreConnection';

export default function AddBook(){

    const [currentUser,setCurrentUser] = useState();
    const [allAuthors,setAllAuthors] = useState([]);
    const [allGenres,setAllGenres] = useState();
    const [isImageUploadPopupOpen, setIsImageUploadPopupOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [authorInputValue, setAuthorInputValue] = useState('');
    const [isAuthorPopupOpen, setIsAuthorPopupOpen] = useState(false);
    const [previousSelectedAuthors,setPreviousSelectedAuthors]= useState([]);
    const [genreFilteredSuggestions,setGenreFilteredSuggestions] = useState([]);
    const [selectedGenres,setSelectedGenres] = useState([]);
    const [genreInputValue,setGenreInputValue] = useState('');
    const [previousSelectedGenres,setPreviousSelectedGenres] = useState([]);
    const navigate = useNavigate();
    const suggestionsRef = useRef(null);
    const genreSuggestionsRef = useRef(null);
    const [title, setTitle] = useState('');
    const [isbn, setIsbn] = useState('');
    const [publisher, setPublisher] = useState('');
    const [publishedDate, setPublishedDate] = useState('');
    const [language, setLanguage] = useState('');
    const [bookUrl, setBookUrl] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {                              
                const user = await getUserInfo();            
                setCurrentUser(user)
                const authors = await getAllAuthors();              
                setAllAuthors([...authors]);
                const genres = await getAllGenres();
                setAllGenres(genres);
            } catch (error) {
                console.error('Error fetching book info:', error);
            }
        };    
        fetchData();
    },[]);

    useEffect(() => {
      const handleClickOutside = (event) => {
          if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
              setFilteredSuggestions([]);
              setAuthorInputValue('');
          }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [suggestionsRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (genreSuggestionsRef.current && !genreSuggestionsRef.current.contains(event.target)) {
            setGenreFilteredSuggestions([]);
            setGenreInputValue('');
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, [genreSuggestionsRef]);

    const handleOpenImageUploadPopup = () => {
        setIsImageUploadPopupOpen(true);
      };
      
    const handleImageSelected = (imageurl) => {
        setImageUrl(imageurl);
        setIsImageUploadPopupOpen(false);
      };

      const handleAuthorInputChange = (event) => {
        const value = event.target.value.toLowerCase(); 
        setAuthorInputValue(value);
        if (value) {
          const filteredSuggestions = allAuthors.filter((author) =>
            author.authorName.toLowerCase().startsWith(value)
          );
          setFilteredSuggestions(filteredSuggestions); 
        } else {
          setFilteredSuggestions([]); 
        }
      };
      const handleGenreInputChange = (event) => {
        const value = event.target.value.toLowerCase(); 
        setGenreInputValue(value);
        if (value) {
          const filteredSuggestions = allGenres.filter((genre) =>
            genre.name.toLowerCase().startsWith(value)
          );
          setGenreFilteredSuggestions(filteredSuggestions); 
        } else {
          setGenreFilteredSuggestions([]); 
        }
      };
    
      const handleSelectSuggestion = (author) => {
        setSelectedAuthors([...selectedAuthors, author]);
        setPreviousSelectedAuthors(selectedAuthors);
        setAuthorInputValue(''); 
        setFilteredSuggestions([]); 
      };
      const handleGenreSelectSuggestion = (genre) => {
        setSelectedGenres([...selectedGenres, genre]);
        setPreviousSelectedGenres(selectedGenres);
        setGenreInputValue(''); 
        setGenreFilteredSuggestions([]); 
      };

      const handleOpenAuthorForm = () => {
        setIsAuthorPopupOpen(true);
       };


       const handleNewAuthor = async (newAuthor) => {
        try {
          const token = tokenValidation(navigate);
          if(token)
            { 
              const addedAuthor = await addNewAuthor(newAuthor.authorName, newAuthor.birthDate, newAuthor.workCount,token);
              setAllAuthors([...allAuthors, addedAuthor]);
              setSelectedAuthors([...selectedAuthors, addedAuthor]);
              setIsAuthorPopupOpen(false);
            }
           
        } catch (error) {
            console.error('Error adding new author:', error);
        }
    };
    const handleUndoSelection = () => {   
          const updatedSelectedAuthors = [...selectedAuthors];
          updatedSelectedAuthors.pop(); 
          setSelectedAuthors(updatedSelectedAuthors);
          setPreviousSelectedAuthors(updatedSelectedAuthors); 
    
  };
  const handleUndoSelectionGenre = () => {   
    const updatedSelectedGenres = [...selectedGenres];
    updatedSelectedGernes.pop(); 
    setSelectedAuthors(updatedSelectedGenres);
    setPreviousSelectedAuthors(updatedSelectedGenres); 

};
     
   
    const handleSubmit = async (e) => {
        e.preventDefault();
          try{
            const token = tokenValidation(navigate);
            if(token)
              { 
              const model = {ISBN:isbn,Title:title,Publisher:publisher,PublishedDate:publishedDate,Language:language,BookUrl:bookUrl,CoverUrl:imageUrl,UserId:currentUser.id};
              const newBookId = await addNewBook(model,token);
              if(newBookId)
                {
                  selectedAuthors.forEach(async (author) =>{
                      await addAuthorConnection(author.id,newBookId,token);
                  })
                  selectedGenres.forEach(async(genre) => {
                    await addGenreConnection(newBookId,genre.id,token);
                  })
                }
              }
              navigate(`/book/${newBookId}`);
          }catch(error){console.log("Failed to add new book"+error)};
      };

    return(
        <>
      {currentUser ? (        
        <div className="editpage-container">
            <form onSubmit={handleSubmit} className="edit-book-form">
            <h2 className='form-title'>Add New Book</h2>
            <div className='editform-input'>       
            <label htmlFor="title">Title:</label>
            <input
                type="text"
                id="title"
                placeholder="Add Book Title"
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            </div>
            <div className='editform-input'>
            <label htmlFor="isbn">ISBN:</label>
            <input
                type="text"
                id="isbn"
                placeholder="Add ISBN"
                onChange={(e) => setIsbn(e.target.value)}              
            />
            </div>
            <div className="editform-input">
              <label htmlFor="authors">Author(s):</label>
              <div className="editform-input-authors">
              <div className="selected-authors-container">
              <div className="selected-authors-input">
                {selectedAuthors.length > 0 ? (
                  selectedAuthors.map((author, index) => (
                    <span key={author.id}>
                      {author.authorName}{index < selectedAuthors.length - 1 ? ', ' : ''}
                    </span>
                  ))
                ) : (
                  <span >No Authors Selected</span>
                )}
              </div>
              <button type="button" onClick={handleUndoSelection} className='undo-button'>
                <IoArrowUndoCircleOutline size={25} color='#db4c2b' />
              </button>
            </div>
              <div className="author-select-wrapper" ref={suggestionsRef}>
                <input
                  type="text"
                  placeholder="Search & select existing author"
                  value={authorInputValue}
                  onChange={handleAuthorInputChange}                                   
                />
                {filteredSuggestions.length > 0 && (
                  <ul className="suggestion-list"> 
                    {filteredSuggestions.map((author) => (
                      <li
                        key={author.id}
                        onClick={() => handleSelectSuggestion(author)}
                      >
                        {author.authorName}
                      </li>
                    ))}
                  </ul>
                )} 
                 <button onClick={handleOpenAuthorForm} className='editform-addauthorBtn'>Add</button>  
                 {isAuthorPopupOpen && (<AddNewAuthorPopup isOpen={isAuthorPopupOpen} 
                    onClose={() => setIsAuthorPopupOpen(false)} 
                    handleNewAuthor={handleNewAuthor}></AddNewAuthorPopup>)} 
              </div>
              </div>             
            </div>
            <div className="editform-input">
              <label htmlFor="genres">Category(s):</label>
              <div className="editform-input-authors">
              <div className="selected-authors-container">
              <div className="selected-authors-input">
                {selectedGenres.length > 0 ? (
                  selectedGenres.map((genre, index) => (
                    <span key={genre.id}>
                      {genre.name}{index < selectedGenres.length - 1 ? ', ' : ''}
                    </span>
                  ))
                ) : (
                  <span >No Category Selected</span>
                )}
              </div>
              <button type="button" onClick={handleUndoSelectionGenre} className='undo-button'>
                <IoArrowUndoCircleOutline size={25} color='#db4c2b' />
              </button>
            </div>
              <div className="genre-select-wrapper" ref={genreSuggestionsRef}>
                <input
                  type="text"
                  placeholder="Search & select existing genre"
                  value={genreInputValue}
                  onChange={handleGenreInputChange}                                   
                />
                {genreFilteredSuggestions.length > 0 && (
                  <ul className="genre-suggestion-list"> 
                    {genreFilteredSuggestions.map((genre) => (
                      <li
                        key={genre.id}
                        onClick={() => handleGenreSelectSuggestion(genre)}
                      >
                        {genre.name}
                      </li>
                    ))}
                  </ul>
                )}
                 
              </div>
              </div>
              
              
            </div>
            <div className='editform-input'>
            <label htmlFor="publisher">Publisher:</label>
            <input
                type="text"
                id="publisher"
                placeholder="Add Publisher"
                onChange={(e) => setPublisher(e.target.value)}          
            />
            </div>
            <div className='editform-input'>
            <label htmlFor="publishedDate">Published Date:</label>
            <input
                type="text"
                id="publishedDate"
                placeholder="Add Published Date"
                onChange={(e) => setPublishedDate(e.target.value)}              
            />
            </div>
            <div className='editform-input'>
            <label htmlFor="language">Language:</label>
            <input
                type="text"
                id="language"
                placeholder="Add Language"
                onChange={(e) => setLanguage(e.target.value)}              
            />
            </div>
            <div className='editform-input'>
            <label htmlFor="bookUrl">Book URL:</label>
            <input
                type="text"
                id="bookUrl"
                placeholder="Add Book URL"
                onChange={(e) => setBookUrl(e.target.value)}                
            />
            </div>
            <div className='editform-input'>
            <label>User:</label>
            <input type="text" value={currentUser.username} disabled />
            </div>
            <div className='editform-input'>     
            <label htmlFor="coverUrl">Book Cover:</label>
            <div className='editform-author'>
            <img src={imageUrl} className='editform-coverUrl'></img>                
            <button onClick={handleOpenImageUploadPopup} className='editform-addauthorBtn'>Add</button>
            {isImageUploadPopupOpen && (<LoadImagePopup isOpen={isImageUploadPopupOpen} onClose={() => setIsImageUploadPopupOpen(false)} onImageSelected={handleImageSelected} />)}
            </div>
            
            </div>    
            <button type="submit" className='editform-saveBtn'>Save Changes</button>
            </form>
    </div>
) : (<></>)} </>
    )
}