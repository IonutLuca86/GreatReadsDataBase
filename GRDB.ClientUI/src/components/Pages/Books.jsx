import { useEffect, useState } from 'react'
import './Books.css'
import getAllBooks from '../Functions/GetAllBooks';
import BookListCard from '../BookComponents/BookListCard';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { FaSearch } from "react-icons/fa";




export default function Books () {

    const [allBooks,setAllBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState(''); 
    const [originalBooks,setOriginalBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const handleNextPage = () => setCurrentPage(currentPage + 1);
    const handlePrevPage = () => setCurrentPage(currentPage - 1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const books = await getAllBooks();
                setAllBooks([...books]);
                setFilteredBooks([...books]);
                setOriginalBooks([...books]);
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
            setFilteredBooks(filteredBooks);    
            if(searchText === '')
                {
                    setFilteredBooks(originalBooks);
                }   
                setCurrentPage(1);      
        };

    const handleSortChange = (selectedOption) => {
        setSortBy(selectedOption);
        const sortedBooks = [...filteredBooks];
        if (selectedOption === 'titleAZ') {
            sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
          setAllBooks(sortedBooks);
        } else if (selectedOption === 'titleZA') {
          sortedBooks.sort((a, b) => b.title.localeCompare(a.title));
          setAllBooks(sortedBooks);
         }
         else if (selectedOption === 'reviews91') {
             sortedBooks.sort((a, b) => b.bookReviews.length-a.bookReviews.length);
            setAllBooks(sortedBooks);
           }
           else if (selectedOption === 'reviews19') {
             sortedBooks.sort((a, b) => a.bookReviews.length-b.bookReviews.length);
            setAllBooks(sortedBooks);
           }
           setFilteredBooks(sortedBooks);
        setCurrentPage(1);
      };



    console.log(allBooks)

    return(
        <>
        {loading ? (<div className='spinner'><Spinner animation="border" variant="primary" size='20'/></div>) : (
            <div className="books-container">
                <div className='books-header'>
                    <label className='books-counter'>Showing {currentBooks.length*currentPage} of {filteredBooks.length} books</label>
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
            <div className="books-pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className='books-pagination-button me-2'>Previous Page</button>
                <button onClick={handleNextPage} disabled={indexOfLastBook >= filteredBooks.length} className='books-pagination-button'>Next Page</button>
            </div>
            </div>
            
        )}
       
        </>
    )
}