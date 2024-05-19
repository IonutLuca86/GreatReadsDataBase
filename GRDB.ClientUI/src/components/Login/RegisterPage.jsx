import React, { useState } from 'react';
import './Login.css'
import registerUser from '../Functions/RegisterUser';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit =async (event) => {
    event.preventDefault(); 
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    try {
      const registerModel = {username:username,email:email,password:password,confirmPassword:confirmPassword};
      const registerStatus = await registerUser(registerModel);
      if (registerStatus) {
        setErrorMessage('');
        console.log('Register successful!');       
        navigate('/login');
      } else {
        setErrorMessage('Registration failed.Please complete the form properly!');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during registration. Please try again.');
    }
    };

  return (
    <div className='login-page'>
       <div>
      <h2 className='login-welcome'>Want to unlock all features?</h2>
      </div> 
    <div className="register-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            required
            className='login-input'
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
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
        <button type="submit" className='login-button'>Register</button>
      </form>
    </div>
    </div>
  );
};

export default RegisterForm;
