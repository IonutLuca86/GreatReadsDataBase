import { useEffect, useState } from "react"
import getBookInfo from "../Functions/GetBookInfo";
import { Link, useNavigate, useParams } from "react-router-dom";
import './Book.css'
import ReviewComponent from "../BookComponents/ReviewsComponent";
import getUserInfo from '../Functions/GetUserInfo';
import Spinner from 'react-bootstrap/Spinner';
import deleteBook from "../Functions/DeleteBook";
import tokenValidation from "../Functions/TokenValidation";

export default function Book() {
    const bookId = useParams();
    const [book,setBook] = useState();
    const [currentUser,setCurrentUser] = useState();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getUserInfo();
                if(user !== null)
                    {
                        setCurrentUser(user);                       
                    }
                const response = await getBookInfo(bookId.bookId);
                setBook(response);
               
            } catch (error) {
                console.error('Error fetching book info:', error);
            }finally {
                setLoading(false); 
            }
        };    
        fetchData();
    },[]);

    const handleDeleteBook = () => {
        setShowConfirmation(true);
        console.log("test delete")
    }
    const handleConfirmDelete = async () => { 
        setShowConfirmation(false);
        try {   
            const token = tokenValidation(navigate);
            if(token)
              {  
                if(book.bookReviews.length > 0)
                    {
                        alert("Book cannot be deleted because it has active reviews!")
                        setShowConfirmation(false);
                    }
                else  
                {
                    await  deleteBook(book.id,token);
                    navigate('/books')
                }
                       
              }
          } catch (error) {
              console.error('Error deleting book:', error);
          }
     
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
    };
 console.log(book)
    return(
        <>
        {loading ? (<div className='spinner'><Spinner animation="border" variant="primary" size='20'/></div>) : (
        <div className="book-main-container">
            <div className="book-container">
            <div className="book-cover-container">
                <img src={book.coverUrl} alt={book.title} className="book-cover" />
            </div>  
      
        <div className="book-info-container">
                <div className="book-info">
                    <p className="p-title me-4">Title:</p>
                    <p className="book-title">{book.title}</p>
                </div>
                <div className="book-info">
                    <p className="p-title me-4">ISBN:</p>
                    <p className="book-other">{book.isbn}</p>
                </div>
                <div className="book-info">
                    <p className="p-title me-4">Author:</p>
                    <div className='book-author'>{book.authors.length === 1 ? (              
                    <p key={book.authors[0].id}>{book.authors[0].authorName}</p>
                ) : (                   
                    <p className='book-author'>
                        {book.authors.map((author, index) => (
                            <span key={author.id}>
                                {author.authorName}
                                {index < book.authors.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </p>
                )}</div>
                </div>
                <div className="book-info">
                    <p className="p-title me-4">Category:</p>
                    {book.bookGenres.length === 1 ? (                
                    <p key={book.bookGenres[0].id} className='book-category'>{book.bookGenres[0].name}</p>
                ) : (       
                    <p className='book-category'>
                        {book.bookGenres.map((genre, index) => (
                            <span key={genre.id}>
                                {genre.name}
                                {index < book.bookGenres.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </p>
                )}
                </div>
                <div className="book-info">
                    <p className="p-title me-4">Language:</p>
                    <p className="book-other">{book.language}</p>
                </div>
                <div className="book-info">
                    <p className="p-title me-4">Publisher:</p>
                    <p className="book-other">{book.publisher}</p>
                </div>
                <div className="book-info">
                    <p className="p-title me-4">Publish Date:</p>
                    <p className="book-other">{book.publishedDate}</p>
                </div>
                <div className="book-info">
                    <p className="p-title me-4">Book Url:</p>
                    <a href={book.bookUrl} target="_blank" rel="noopener noreferrer" className="book-link">click here</a>
                </div>
                {currentUser && book.user.id === currentUser.id ? (
                    <div className="book-edit">
                        <button className="cp-button">    <Link to={{
                            pathname: `/editbook/${book.id}`,
                            state: { initialBookData: book }
                        }} className="edit-link"  >Edit</Link></button>                       
                         <button onClick={() => handleDeleteBook(book.id)} className="cp-button deleteBtn">Delete</button>
                         {showConfirmation && (
                            <div className="confirmation-overlay">
                                <div className="confirmation-modal">
                                    <p>Are you sure you want to delete?</p>
                                    <div>
                                    <button onClick={handleConfirmDelete} className="me-5">Yes</button>
                                    <button onClick={handleCancelDelete}>No</button>
                                    </div>
                                   
                                </div>
                            </div>
                        )}
                    </div>
                )                
                : (<></>)}
            </div>
            </div>
        
                <div className="book-reviews-container">
                <ReviewComponent bookId={book.id} currentUser={currentUser} ></ReviewComponent>
                </div> 
         
            
        </div>

        
         ) }
        </>
    );
}