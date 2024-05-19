import { useState,useEffect } from 'react';
import addNewAuthor from '../Functions/AddNewAuthor';

export default function AddNewAuthorPopup({isOpen,onClose,handleNewAuthor}){

    const [authorName, setAuthorName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [workCount, setWorkCount] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newAuthor = { authorName, birthDate, workCount };
        handleNewAuthor(newAuthor); 
        onClose();  
        
      };

      const handleCancel = () => {
        onClose();
      }

    return(
        <div className={`author-selection-popup ${isOpen ? 'active' : ''}`}>
        <div className='popup-content'>
        <h2>Add New Author</h2>
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
      <div>
      <button type="button" className='editform-saveBtn mt-2' onClick={handleCancel}>Cancel</button>
      <button type="button" className='editform-saveBtn mt-2' onClick={handleSubmit}>Add New Author</button>
      </div>
    
    
 
       </div>
       </div>
           
           </div>
    )
}