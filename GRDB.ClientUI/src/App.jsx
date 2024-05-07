import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from './components/Navbar/Navbar'

function App() {
  const [count, setCount] = useState(0)

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFkbWluIiwianRpIjoiMTMzOGE0MzAtMWRlNC00ZTI4LTkzY2UtZWQ4MzA5NWE0M2M4Iiwicm9sZSI6WyJBZG1pbiIsIlVzZXIiXSwibmJmIjoxNzE1MDE5NDYwLCJleHAiOjE3MTUxMDU4NjAsImlhdCI6MTcxNTAxOTQ2MCwiaXNzIjoiZ3JkYi5hZG1pbnVpLnNlcnZlciIsImF1ZCI6ImdyZGIuY2xpZW50cyJ9.zZa4vDXCUTbGsz_wLv29-W_BN7ZvVG4qholhDd1dhjs";
const headers = {
  'Authorization': `Bearer ${token}`
};
const genre = {Name: "reacttest",};
const requestOptions = {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(genre)
};

try {
  const response = fetch('http://localhost:5500/api/Genre', requestOptions);
  if (response.ok) {
    console.log(response);
  } else {
    console.log(response);
  }
} catch (error) {
  console.log(error);
}


  return (
    <>
    <NavBar></NavBar>
 
    </>
  )
}

export default App
