
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import getAllBooks from '../Functions/GetAllBooks';
import { Link } from 'react-router-dom';
import BookListCard from '../BookComponents/BookListCard';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {

    const query = useQuery();
    const searchTerm = query.get('q');
    const [results, setResults] = useState([]);
    const [originalBooks,setOriginalBooks] = useState([]);
    const [allBooks,setAllBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(10);
    const [sortBy, setSortBy] = useState(''); 
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = allBooks.slice(indexOfFirstBook, indexOfLastBook);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const handleNextPage = () => setCurrentPage(currentPage + 1);
    const handlePrevPage = () => setCurrentPage(currentPage - 1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const books = await getAllBooks();
               if(books){
                if(searchTerm)
                    {
                        const filteredBooks = books.filter((book) => {
                            const titleMatch = book.title.toLowerCase().includes(searchTerm);
                            const authorMatch = book.authors.some(author => author.authorName.toLowerCase().includes(searchTerm));
                            const genreMatch = book.bookGenres.some(genre => genre.name.toLowerCase().includes(searchTerm));
                            const publisherMatch = book.publisher.toLowerCase().includes(searchTerm);
                            const isbnMatch = book.isbn.toLowerCase().includes(searchTerm);
                            const languageMatch = book.language.toLowerCase().includes(searchTerm);

                            return titleMatch || authorMatch || genreMatch || publisherMatch || isbnMatch || languageMatch;
                        });
                        setAllBooks(filteredBooks);     
                    }}
            } catch (error) {
                console.error('Error fetching books:', error);
            }
            
        };
    
        fetchData();
    },[]);

    const sortOptions = [
        {value: 'titleAZ', label: 'Title A-Z'},
        {value: 'titleZA', label: 'Title Z-A'},
        {value: 'reviews19', label: 'Reviews 1-9'},
        {value: 'reviews91', label: 'Reviews 9-1'},   
    ];

    const handleSortChange = (selectedOption) => {
        setSortBy(selectedOption);

        if (selectedOption === 'titleAZ') {
          const sortedBooks = allBooks.sort((a, b) => a.title.localeCompare(b.title));
          setAllBooks(sortedBooks);
        } else if (selectedOption === 'titleZA') {
          const sortedBooks = allBooks.sort((a, b) => b.title.localeCompare(a.title));
          setAllBooks(sortedBooks);
         }
         else if (selectedOption === 'reviews91') {
            const sortedBooks = allBooks.sort((a, b) => b.bookReviews.length-a.bookReviews.length);
            setAllBooks(sortedBooks);
           }
           else if (selectedOption === 'reviews19') {
            const sortedBooks = allBooks.sort((a, b) => a.bookReviews.length-b.bookReviews.length);
            setAllBooks(sortedBooks);
           }
      };

    return(
        <>
        {allBooks ? (
            <div className="books-container">
                <div className='books-header'>
                    <label className='books-counter'>Showing {currentBooks.length} of {allBooks.length} books</label>
                    <div className='books-sort-container'>
                        <label>SortBy</label>
                        <select
                        id="sortSelect"
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className='books-sort-select'
                        >
                        <option value="">--Select--</option> {/* Default option */}
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                            {option.label}
                            </option>
                        ))}
                        </select>
                    </div>
                </div>
            {currentBooks.map((book) => 
                <Link to={`/book/${book.id}`} key={book.id} className='bookLink'><BookListCard book = {book}></BookListCard></Link>              
            )}
            <div className="books-pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className='books-pagination-button me-2'>Previous Page</button>
                <button onClick={handleNextPage} disabled={indexOfLastBook >= allBooks.length} className='books-pagination-button'>Next Page</button>
            </div>
            </div>
            
        ):(<Spinner animation="border" variant="primary" className='spinner'/>)}
       
        </>
    )

}