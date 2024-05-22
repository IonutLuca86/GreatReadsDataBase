  import Carousel from '../Carousel/Carousel'
  import SearchBar from '../Navbar/SearchBar'
  import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useState,useEffect } from 'react';
import getAllBooks from '../Functions/GetAllBooks';
import './styles.css';
import { Link } from 'react-router-dom';
import getAllAuthors from '../Functions/GetAllAuthors';
import getAllGenres from '../Functions/GetAllGenres';
import logo from '../../assets/svg/logo-no-background.svg'
import getRecommendedBooks from '../Functions/GetRecommendedBooks';
import getTopRatedBooks from '../Functions/GetTopRatedBooks';


function getRandomBooks(books, count) {
  const shuffled = [...books].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
function getRandomGenres(genres, count) {
  const shuffled = [...genres].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
 
function getRandomAuthors(authors, count) {
  const shuffled = [...authors].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
function getMostReviews(books,count){
  return [...books].sort((a,b) => b.bookReviews.length -a.bookReviews.length).slice(0,count);
}
  
  export default function Home () {
    
    const [bookSuggestions,setBookSuggestions] = useState([]);
    const [searchedBooks,setSearchedBooks] = useState([]);
    const [searchedAuthors,setSearchedAuthors] = useState([]);
    const [searchedGenres,setSearchedGenres] = useState([]);
    const [searchedReviews,setSearchedReviews] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
          try {
              const recommendedbooks = await getRecommendedBooks(6);
              setBookSuggestions(recommendedbooks);       
              const authors = await getAllAuthors();
              setSearchedAuthors(getRandomAuthors(authors,5));
              const genres = await getAllGenres();
              setSearchedGenres(getRandomGenres(genres,5));
              const topratedBooks = await getTopRatedBooks(5);
              setSearchedReviews(topratedBooks);
          } catch (error) {
              console.error('Error fetching books:', error);
          }
      };
  
      fetchData();
  },[]);

  const normalizeBookTitle = (title) => {
    if(title.length > 25)
      {
        const truncatedTitle = title.slice(0,20)+'...';
        return truncatedTitle;
      }
      else{
        return title;
      }
     
  }


    return(

        <div className='home-container'>
        <Carousel></Carousel>
        <SearchBar></SearchBar>
        <div className='book-search-suggestions'>
          <h5 className='rubrik'>Not sure what to search? Inspire yourself from what others searched:</h5>
          <div className='search-suggestions'>
          <div className='suggestions'>
              <h6 className='suggestion-title'>Books with most reviews:</h6>
              <div className='searched-books'>
                {searchedReviews && searchedReviews.map((book) =>
                <Link to={`/book/${book.id}`} key={book.id} className='bookLink'> - {book.title}</Link>           
                )}
              </div> 
            </div>
            {/* <div className='suggestions'>
              <h6>Most searched books:</h6>
              <div className='searched-books'>
                {searchedBooks && searchedBooks.map((book) =>
                <Link to={`/book/${book.id}`} className='bookLink' key={book.id}> - {book.title}</Link>
                )}
              </div>
            </div> */}
            <div className='suggestions'>
              <h6 className='suggestion-title'>Most searched authors:</h6>
              <div className='searched-books'>
                {searchedAuthors && searchedAuthors.map((author) =>
                <Link to={`/search?q=${encodeURIComponent(author.authorName)}`} key={author.id} className='bookLink'> - {author.authorName}</Link>           
                )}
              </div>       
            </div>
            <div className='suggestions'>
              <h6 className='suggestion-title'>Most searched categories:</h6>
              <div className='searched-books'>
                {searchedGenres && searchedGenres.map((genre) =>
                <Link to={`/search?q=${genre.name}`} key={genre.id} className='bookLink'> - {genre.name}</Link>           
                )}
              </div> 
            </div>           
          </div>
        </div>
        <div className='book-card-suggestions'>
          <h5 className='rubrik'>Here are some books we recommend:</h5>
          <div className='card-suggestions'> 
          {bookSuggestions && bookSuggestions.map((book) =>
           <Link to={`/book/${book.id}`} className='bookLink card-info' key={book.id} >
          <Card style={{ width: '14rem' }}>
                <Card.Img variant="top" src={book.coverUrl} className='card-image'/>
                <Card.Body>
                  <Card.Title style={{fontSize:"14px"}}>{normalizeBookTitle(book.title)}</Card.Title>                  
                </Card.Body>
                <ListGroup className="list-group-flush listgroup">
                  <ListGroup.Item style={{fontSize:"smaller"}}>{book.authors.map(x => x.authorName).join(',')}</ListGroup.Item>
                  <ListGroup.Item style={{fontSize:"smaller"}}>{book.bookGenres.map(x => x.name).join(',')}</ListGroup.Item>
                  <ListGroup.Item>Reviews : {book.bookReviews.length}</ListGroup.Item>
                </ListGroup>              
              </Card></Link>
          )}
          </div>
        </div>
        <div>
          <img src={logo} alt="logo" className='home-logo' />
        </div>
        </div>
        
   
    )
  }