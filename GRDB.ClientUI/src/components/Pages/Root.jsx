import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import NavbarComponent from '../Navbar/Navbar';
import Footer from '../Navbar/Footer';
import './styles.css'
import tokenValidation from '../Functions/TokenValidation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/actions/authActions';


export default function Root() {
const dispatch = useDispatch();
const expiration = useSelector((state) => state.auth.expiration);
const token = useSelector((state) => state.auth.token);
const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
const navigate = useNavigate();
useEffect(() => {
  const expirationDate = new Date(expiration);
  const currentTime = new Date();
  if(isLoggedIn)
    {
      if(!token || expirationDate < currentTime)
        {
          alert("Your login session has expired! Plase login again!");
          dispatch(logout);
          navigate('/login');
        }
    }
  
   
},[token,dispatch])
  return (
    <div className='layout'>
          <NavbarComponent/>    
         <Outlet className="outlet"/>
         <Footer/>
    </div>
  )
}