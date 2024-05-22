
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import getAllBooks from '../Functions/GetAllBooks';
import { Link } from 'react-router-dom';
import BookListCard from '../BookComponents/BookListCard';
import Spinner from 'react-bootstrap/esm/Spinner';
import { FaSearch } from "react-icons/fa";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {

    const query = useQuery();
    const [searchTerm,setSearchTerm] = useState(query.get('q'));
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const books = await getAllBooks();
                setOriginalBooks(books);
               if(books){
                if(searchTerm)
                    {                        
                        const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
                       const filteredBooks = books.filter((book) => {
                           const titleMatch = book.title.toLowerCase().includes(lowerCaseSearchTerm);
                           const authorMatch = book.authors.some(author => author.authorName.toLowerCase().includes(lowerCaseSearchTerm));
                           const genreMatch = book.bookGenres.some(genre => genre.name.toLowerCase().includes(lowerCaseSearchTerm));
                           const publisherMatch = book.publisher.toLowerCase().includes(lowerCaseSearchTerm);
                           const isbnMatch = book.isbn.toLowerCase().includes(lowerCaseSearchTerm);
                           const languageMatch = book.language.toLowerCase().includes(lowerCaseSearchTerm);

                            return titleMatch || authorMatch || genreMatch || publisherMatch || isbnMatch || languageMatch;
                        });
                        setAllBooks(filteredBooks);     
                    }}
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setLoading(false); 
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
    const handleSubmit = (e) => {
        e.preventDefault();
    };
      

    const handleSearchChange = (event) => {            
            const searchText = event.target.value.toLowerCase().trim();
            setSearchTerm(searchText);
            const filteredBooks = allBooks.filter((book) => {
                const titleMatch = book.title.toLowerCase().includes(searchText);
                const authorMatch = book.authors.some(author => author.authorName.toLowerCase().includes(searchText));
                const genreMatch = book.bookGenres.some(genre => genre.name.toLowerCase().includes(searchText));
                return titleMatch || authorMatch || genreMatch;
            });
            setAllBooks(filteredBooks);    
            if(searchText === '')
                {
                    setAllBooks(originalBooks);
                }   
                setCurrentPage(1);      
        };
      

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
      console.log(allBooks)

    return(
        <>
        {loading ? (<div className='spinner'><Spinner animation="border" variant="primary" size='20'/></div>) : (
            <div className="books-container">
                <div className='books-header'>
                    <label className='books-counter'>Showing {currentBooks.length*currentPage} of {allBooks.length} books</label>
                                 
                    <form className="books-search-bar" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                         onChange={handleSearchChange}
                         className='books-search-bar-input'
                    />                   
                    <button type="submit" className='books-search-bar-button'><FaSearch /></button>                
                    
                    </form>
                 
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
            {allBooks.length > 10 ? 
            (<div className="books-pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className='books-pagination-button me-2'>Previous Page</button>
                <button onClick={handleNextPage} disabled={indexOfLastBook >= allBooks.length} className='books-pagination-button'>Next Page</button>
            </div>):(<></>)}
            </div>
            
        )}
       
        </>
    )

}