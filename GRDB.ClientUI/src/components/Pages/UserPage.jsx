import { useEffect, useState } from "react"
import getUserInfo from "../Functions/GetUserInfo";
import './UserPage.css'
import getUserBooks from "../Functions/GetUserBooks";
import BookListCard from "../BookComponents/BookListCard";
import { Link, useNavigate } from "react-router-dom";
import changePassword from "../Functions/ChangePassword";
import tokenValidation from "../Functions/TokenValidation";
import Spinner from 'react-bootstrap/Spinner';

export default function UserPage() {

const [user,setUser] = useState(null);
const [books,setBooks] = useState();
const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [formEnabled,setFormEnabled] = useState(false);
const [isEnabled,setIsEnabled] = useState(true);
const navigate = useNavigate();



useEffect( () => {
    const fetchData = async () => {
        try{        
            const userinfo =await getUserInfo();
            if(userinfo)
                {
                    setUser(userinfo);
                }
           
            const response = await getUserBooks(userinfo.id);
            console.log(response)
            if(response)
                {
                    setBooks(response);
                }
            
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };
    fetchData();
},[]);

const handleChangePassword = () => {
    setFormEnabled(true);
    setIsEnabled(false);
}
const handleCurrentPass = (event) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };
  const handleSubmit =async (event) => {
    event.preventDefault(); 
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    try {
        const toke = await tokenValidation(navigate);
        if(token)
            {
            const changeStatus = await changePassword(user.id,currentPassword,newPassword,confirmPassword,token,navigate);
            if (changeStatus) {
                setErrorMessage('');
                console.log('Register successful!');       
                navigate('/login');
            } else {
                setErrorMessage('Change Password failed.Current password does not match!');
            }
            }
      
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during changing password. Please try again.');
    }
    };

    const handleReviews= (bookReviews) => {  
        const total = bookReviews.length;
        const sort = bookReviews.filter(review => review.userId === user.id);
        const own = sort.length;
        return `${own} / ${total} (own/total)`;
    }
    const handleCancel = ()=> {
        setFormEnabled(false);
        setIsEnabled(true);
    }

    return(
        <>
        {user ? (
        <div className="user-container">
            <div className="user-info-container">
                <div className="user-title">
                    <p className="book-title">User Information</p>
                </div>
                <div className="user-info">
            <div className="book-info">
                    <p className="p-title me-4">User Name:</p>
                    <p className="book-title">{user.username}</p>
                </div>
                <div className="book-info">
                    <p className="p-title me-4">Email:</p>
                    <p className="book-title">{user.email}</p>
                </div>
                </div>
                {isEnabled ? <button className="cp-button" onClick={handleChangePassword}>Change Password</button> : <></>}
                 {formEnabled ? (
                    <form onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                      <label htmlFor="email">Current Password:</label>
                      <input
                        type="password"
                        id="cpass"
                        name="cpass"
                        value={currentPassword}
                        onChange={handleCurrentPass}
                        required
                        className='login-input'
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">New Password:</label>
                      <input
                        type="password"
                        id="npassword"
                        name="npassword"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        required
                        className='login-input'
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password:</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                        className='login-input'
                      />
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit" className='cp-button'>Change Password</button>
                    <button type="button" className='cp-button' onClick={handleCancel}>Cancel</button>
                  </form>
                 ) : (<></>)}
                </div>
          <div className="user-books">
          <div className="user-title">
                    <p className="book-title">Users Contribution</p>
                </div>
            <div className="user-book-container">
          {books ? (books.map((book) => 
               
                    <div key = {book.id} className="user-book-info">
                    <div className='listCard-title'>
                <p className='me-2 p-title'>Book Title:</p>
                <Link to={`/book/${book.id}`} key={book.id} className='bookLink' style={{color:'#db4c2b',fontSize:'large'}}>{book.title}</Link> 
                </div>
                <div className='listCard-title'>
                <p className='me-2 p-title'>Reviews:</p>
                    <p className='book-category'>{handleReviews(book.bookReviews)}</p>
                </div>
                    </div>

                         
            )) : (<p>No books found</p>)}
          </div>
          </div>
        </div>
        ) : (<Spinner animation="border" variant="primary" size='20' className='spinner'/>)}
        </>
    )
}