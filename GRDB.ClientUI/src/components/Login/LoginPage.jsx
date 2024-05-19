import React, { useState,useEffect} from 'react';
import './Login.css'
import performLogin from '../Functions/HandleLogin';
import { useNavigate } from 'react-router-dom';
import GetUserInfo from '../Functions/GetUserInfo';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../redux/actions/authActions'

export default function LoginPage () {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      dispatch(login(JSON.parse(userData)));
    }
  }, []);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const loginSuccessful = await performLogin(username, password);
      if (loginSuccessful) {
        setErrorMessage('');
        console.log('Login successful!');
        dispatch(login(loginSuccessful));
        navigate('/');
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during login. Please try again.');
    }
  };
  
  

  return (
    <div className="login-page">
      <div>
      <h2 className='login-welcome'>Welcome back!</h2>
      </div>     
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username" className='login-label'>Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            required
            className='login-input'
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className='login-label'>Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
            className='login-input'
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit"className='login-button mb-4'>Login</button>
      </form>
      <a href="#" className='mb-2'>Forgot Password?</a>
      {/* Optional Register button */}
      <button onClick={() => navigate('/register')} className='login-button'>Register</button>
    </div>
  );
}
