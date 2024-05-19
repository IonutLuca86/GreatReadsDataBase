import { Link } from 'react-router-dom';
import './BookListCard.css'

export default function BookListCard({book}) {

    const numberOfReviews = book.bookReviews && book.bookReviews.length;

 return(
    <div className="listCard-container">
        <div className="listBook-cover-container">
            <p className='listCard-reviews'>{numberOfReviews || 0}</p>
            <img src={book.coverUrl} alt={book.title} className="listCard-image"></img>
        </div>
        <div className="listCard-bookinfo">

                <div className='listCard-title'>
                <p className='me-2 p-title'>Title:</p>
                    <p className='listCard-booktitle'>{book.title}</p>
                </div>

        
            <div className="listCard-bookinfo-column">
                <div className='listCard-info'>
                <p className='me-2 p-title'>Author: </p>
                <div className='book-author'>{book.authors.length === 1 ? (               
                    <p  key={book.authors[0].id} className='author-link'>{book.authors[0].authorName}</p>
                                ) : (                   
                    <p className='book-author'>
                        {book.authors.map((author, index) => (
                            <span  key={author.id} className='author-link'>
                                {author.authorName}
                                {index < book.authors.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </p>
                )}</div>
                </div>
                <div className="listCard-info">
                        <p className='me-2 p-title'>Category: </p>
                        {book.bookGenres && book.bookGenres.length > 0 ? (
                        book.bookGenres.length === 1 ? (
                    // Render single genre directly
                    <p key={book.bookGenres[0].id} className='book-category'>{book.bookGenres[0].name}</p>
                ) : (
                    // Render multiple genres separated by comma and space
                    <p className='book-category'>
                        {book.bookGenres.map((genre, index) => (
                            <span key={genre.id} >
                                {genre.name}
                                {index < book.bookGenres.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </p>
                )):(<p></p>)}
                        </div>
            
            </div>
        {/* <div className='listCard-reviews'>
            <p className='p-title'>Reviews</p>
            <p>1</p>
        </div> */}
          
        </div>
    </div>
 )
}