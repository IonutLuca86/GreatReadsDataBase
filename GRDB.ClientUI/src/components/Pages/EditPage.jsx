import { useNavigate, useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import getUserInfo from '../Functions/GetUserInfo';
import getBookInfo from "../Functions/GetBookInfo";
import Spinner from 'react-bootstrap/Spinner';
import './EditPage.css'
import getAllAuthors from '../Functions/GetAllAuthors';
import getAllGenres from '../Functions/GetAllGenres';
import AuthorSelectionPopup from '../BookComponents/AuthorSelectionPopup';
import LoadImagePopup from '../BookComponents/LoadImagePopup';
import ChangeGenrePopup from '../BookComponents/ChangeGenrePopup';
import updateBook from '../Functions/UpdateBook';
import deleteAuthorConnection from '../Functions/DeleteAuthorConnection';
import deleteGenreConnection from '../Functions/DeleteGenreConnection';
import tokenValidation from '../Functions/TokenValidation';
import addAuthorConnection from '../Functions/AddAuthorConnection';
import addGenreConnection from '../Functions/AddGenreConnection';


export default function EditPage() {

    const {bookId} = useParams();
    const [initialBookData,setInitialBookData] = useState();
    const [currentUser,setCurrentUser] = useState();
    // const [allAuthors,setAllAuthors] = useState([]);
    // const [allGenres,setAllGenres] = useState();
    // const [authorInputValue,setAuthorInputValue] = useState('');
    // const [genreInputValue,setGenreInputValue] = useState();
    const [selectedAuthor, setSelectedAuthor] = useState([]);
    // const [authorSuggestions, setAuthorSuggestions] = useState([]);
    // const [showAddAuthorButton, setShowAddAuthorButton] = useState(false);   
    const [isAuthorPopupOpen, setIsAuthorPopupOpen] = useState(false);
    const [isImageUploadPopupOpen, setIsImageUploadPopupOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [authorsToDelete,setAuthorsToDelete] = useState([]);
    const [authorsUpdate,setAuthorsUpdate] = useState([]);
    const [isGenrePopupOpen,setIsGenrePopupOpen] = useState(false);
    const [selectedGenres,setSelectedGenres] = useState([]);
    const [genresUpdate,setGenresUpdate] = useState([]);
    const [genresToDelete,setGenresToDelete] = useState([]);
    const [title, setTitle] = useState();
    const [isbn, setIsbn] = useState();
    const [publisher, setPublisher] = useState();
    const [publishedDate, setPublishedDate] = useState();
    const [language, setLanguage] = useState();
    const [bookUrl, setBookUrl] = useState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {                          
                const response = await getBookInfo(bookId);
                console.log(response)
                setInitialBookData(response);
                setTitle(response.title);
                setIsbn(response.isbn);
                setPublisher(response.publisher);
                setPublishedDate(response.publishedDate);
                setLanguage(response.language);
                setBookUrl(response.bookUrl);
                setSelectedAuthor(response.authors);
                setSelectedGenres(response.bookGenres);
                setImageUrl(response.coverUrl);
                const user = await getUserInfo();
                setCurrentUser(user)
                // const authors = await getAllAuthors();
                // console.log(authors)
                // setAllAuthors([...authors]);
                // const genres = await getAllGenres();
                // setAllGenres(genres);
            } catch (error) {
                console.error('Error fetching book info:', error);
            } finally {
              setLoading(false); 
          }
        };    
        fetchData();
    },[bookId]);
    
    const existingAuthors = initialBookData?.authors.map((author) => author.authorName) || [];
    const existingGenres = initialBookData?.bookGenres.map(x => x.name) || [] ;




      const handleOpenAuthorForm = () => {
       setIsAuthorPopupOpen(true);
      }
      const handleGenreOpenForm = () => {
        setIsGenrePopupOpen(true);
       }

      const handleOpenImageUploadPopup = () => {
        setIsImageUploadPopupOpen(true);
      };
      
      const handleImageSelected = (imageurl) => {
        setImageUrl(imageurl);
        setIsImageUploadPopupOpen(false);
      };

      const handleReplaceAuthor = (authors) => {
          setSelectedAuthor(authors);
          setAuthorsToDelete(initialBookData.authors);
      };
    
      const handleAddAuthor = (authors) => {
        setSelectedAuthor(prevAuthors => [...prevAuthors, ...authors]);
        setAuthorsUpdate(authors);
    };
    
    const handleReplaceGenres = (genres) =>{
        setGenresToDelete(selectedGenres);
        setSelectedGenres(genres);
    };
    const handleAddToExistingGenre = (genres) =>{
      setSelectedGenres(prevGenres =>[...prevGenres,...genres]);
      setGenresUpdate(genres);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
          const token = tokenValidation(navigate);
          if(token)
            { 
            const model = {Id: initialBookData.id,ISBN:isbn,Title:title,Publisher:publisher,PublishedDate:publishedDate,Language:language,BookUrl:bookUrl,CoverUrl:imageUrl,UserId:currentUser.id};
            const response = await updateBook(initialBookData.id,model,token);
            if(response)
              {
                if(authorsUpdate.length > 0)
                  {
                    authorsUpdate.forEach(async (author) =>{
                      await addAuthorConnection(author.id,initialBookData.id,token);
                  });
                  }
              if(genresUpdate.length > 0){
                genresUpdate.forEach(async(genre) => {
                  await addGenreConnection(initialBookData.id,genre.id,token);
                });
              }
              if(authorsToDelete.length > 0)
                {
                  authorsToDelete.forEach(async(author) =>{
                    await deleteAuthorConnection(initialBookData.id,author.id,token);
                  });
                }
              if(genresToDelete.length > 0)
                {
                  genresToDelete.forEach(async(genre) => {
                    await deleteGenreConnection(initialBookData.id,genre.id,token);
                  });
                }
                navigate(`/book/${initialBookData.id}`);
              }
            }
           
        }catch(error){console.log("Failed to add new book"+error)};
      };
console.log(initialBookData)

    return(
        <>
        {loading ? (<div className='spinner'><Spinner animation="border" variant="primary" size='20'/></div>) : (
            <div className="editpage-container">
            <form onSubmit={handleSubmit} className="edit-book-form">
      <h2 className='form-title'>Edit Book Information</h2>
      <div className='editform-input'>       
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      </div>
      <div className='editform-input'>
      <label htmlFor="isbn">ISBN:</label>
      <input
        type="text"
        id="isbn"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}

      />
    </div>
      <div className='editform-input'>     
      <label htmlFor="authors">Author:</label>
      <div className='editform-author'>
      <input
        type="text"
        value={selectedAuthor.map(author => author.authorName).join(', ') }
        readOnly
        className='editform-authorinput'
        disabled
        />                
        <button type="button" onClick={handleOpenAuthorForm} className='editform-addauthorBtn'>Change</button>  
        {isAuthorPopupOpen && (<AuthorSelectionPopup isOpen={isAuthorPopupOpen} 
        onClose={() => setIsAuthorPopupOpen(false)} 
        existingAuthors={existingAuthors}
        currentAuthor={selectedAuthor.join(', ')} // Pass comma-separated selected authors
        onReplaceAuthor={handleReplaceAuthor} // Replace function callback
        onAddAuthor={handleAddAuthor}  ></AuthorSelectionPopup>)} 
      </div>
      
    </div>
    <div className='editform-input'>     
      <label htmlFor="genres">Category:</label>
      <div className='editform-author'>
      <input
        type="text"
        value={selectedGenres.map(genre => genre.name).join(',')}
        // onChange={handleAuthorInputChange}  
        className='editform-authorinput'
        disabled
        />                
        <button type="button" onClick={handleGenreOpenForm} className='editform-addauthorBtn'>Change</button>
        {isGenrePopupOpen && (<ChangeGenrePopup isOpen={isGenrePopupOpen} onClose={() => setIsGenrePopupOpen(false)} existingGenres={existingGenres} 
        replaceGenres={handleReplaceGenres} addToExisting={handleAddToExistingGenre} />)}
      </div>
      
    </div>
    <div className='editform-input'>
    <label htmlFor="publisher">Publisher:</label>
      <input
        type="text"
        id="publisher"
        value={publisher}
        onChange={(e) => setPublisher(e.target.value)}
  
      />
    </div>
      <div className='editform-input'>
      <label htmlFor="publishedDate">Published Date:</label>
      <input
        type="text"
        id="publishedDate"
        value={publishedDate}
        onChange={(e) => setPublishedDate(e.target.value)} 
      />
      </div>
     <div className='editform-input'>
     <label htmlFor="language">Language:</label>
      <input
        type="text"
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}       
      />
     </div>
      <div className='editform-input'>
      <label htmlFor="bookUrl">Book URL:</label>
      <input
        type="text"
        id="bookUrl"
        value={bookUrl}
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
       <button type="button" onClick={handleOpenImageUploadPopup} className='editform-addauthorBtn'>Change</button>
       {isImageUploadPopupOpen && (<LoadImagePopup isOpen={isImageUploadPopupOpen} onClose={() => setIsImageUploadPopupOpen(false)} onImageSelected={handleImageSelected}/>)}
      </div>
      
    </div>    
      <button type="submit" className='editform-saveBtn'>Save Changes</button>
    </form>
  
        </div>
        ) }
       </> 
    )
}