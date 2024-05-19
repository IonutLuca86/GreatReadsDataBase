import getAllAuthors from '../Functions/GetAllAuthors';
import { useState,useEffect } from 'react';
import './AuthorSelectionPopup.css'
import addNewAuthor from '../Functions/AddNewAuthor';
import tokenValidation from '../Functions/TokenValidation';
import { useNavigate } from 'react-router-dom';

export default function AuthorSelectionPopup({isOpen,onClose,existingAuthors,currentAuthor,onReplaceAuthor,onAddAuthor,}){

    const [allAuthors,setAllAuthors] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState([]);
  const [showChangeButton, setShowChangeButton] = useState(false); 
  const [filteredAuthors, setFilteredAuthors] = useState(allAuthors); 
  const [searchTerm, setSearchTerm] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [workCount, setWorkCount] = useState('');
  const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {   
                const authors = await getAllAuthors();
                console.log(authors)
                setAllAuthors([...authors]);  
                setFilteredAuthors(authors);            
            } catch (error) {
                console.error('Error fetching authors:', error);
            }
        };    
        fetchData();
    },[]);


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        const filtered = allAuthors.filter((author) =>
          author.authorName?.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredAuthors(filtered);
      };

    const handleExistingAuthorClick = (author) => {
      setSelectedAuthor([...selectedAuthor, author]);
      setFilteredAuthors([]); 
      setSearchTerm('');
      };
    
      const handleCancelClick = () => {
        onClose();
      };
      const handleReplaceAuthorClick = () => {       
        onReplaceAuthor(selectedAuthor);
        onClose(); 
      };
    
      const handleAddAuthorClick = () => {
        onAddAuthor(selectedAuthor);        
        onClose(); 
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
        try {   
          const token = tokenValidation(navigate);
          if(token)
            {       
            const newAuthor = await addNewAuthor(authorName, birthDate, workCount,token);
            if(newAuthor)
              {
                setSelectedAuthor(prevAuthors => [...prevAuthors,newAuthor]);
                setAllAuthors(prevAuthors => [...prevAuthors,newAuthor]);       
                setAuthorName('');
                setBirthDate('');
                setWorkCount('');
              }
            else{console.log("Error adding new author")}
            }
        } catch (error) {
            console.error('Error adding new author:', error);
        }
      };    
   
     

    return(
        <>
        <div className={`author-selection-popup ${isOpen ? 'active' : ''}`}>
            <div className='popup-content'>
            <h2>Select an existing author or add a new one:</h2>
            <div className="existing-author-wrapper">
            <label htmlFor="existing-author">Author:</label>
            <input
              type="text"
              value={selectedAuthor.map(author => author.authorName).join(', ')}
              readOnly
              id="existing-author"
              className="existing-author-input"       
            />         
          </div> 
          <div className="existing-author-wrapper">
            <p className='existing-author'>Initial Author(s): {existingAuthors.join(',')}</p>
          </div>
          <div className='author-selection-options'>
          <div className="search-wrapper">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search authors..."
              className="search-input"
            />
               {searchTerm && filteredAuthors.length >0 &&(
            <div className="author-list">
            {filteredAuthors.map((author) => (
              <div className="author-item" key={author.id} onClick={() => handleExistingAuthorClick(author)}>
                <span>{author.authorName}</span>
              </div>
            ))}
          </div>
          )}
          </div>
       <h2 className='px-4'>Or</h2>
       <div className='author-selection-addform'>     
      <div>
        <label htmlFor="authorName">Author Name:</label>
        <input
          type="text"
          id="authorName"
          name="authorName"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="birthDate">Birth Date:</label>
        <input
          type="text"
          id="birthDate"
          name="birthDate"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="workCount">Work Count:</label>
        <input
          type="text"
          id="workCount"
          name="workCount"
          min="0"
          value={workCount}
          onChange={(e) => setWorkCount(e.target.value)}
        />
      </div>
      <button type="button" className='editform-saveBtn mt-2' onClick={handleSubmit}>Add New Author</button>

       </div>
          </div>        
          <div className="button-wrapper">
            <button type="button" onClick={handleCancelClick}>
              Cancel
            </button>
            {!showChangeButton && (
              <div>
                   <button className='cp-button' onClick={handleReplaceAuthorClick}>Replace</button>
            <button className='cp-button' onClick={handleAddAuthorClick}>Add to existent</button>
              </div>
            )}
          </div>
            </div>
           
        </div>
        </>
    )

}