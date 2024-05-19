import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Home from './components/Pages/Home';
import About from './components/Pages/About';
import Contact from './components/Pages/Contact';
import Books from './components/Pages/Books';
import LoginPage from './components/Login/LoginPage';
import RegisterPage from './components/Login/RegisterPage';
import Root from './components/Pages/Root.jsx'
import ScrollToTop from './components/Functions/ScrollToTop.jsx';
import ErrorPage from './components/Pages/ErrorPage.jsx';
import UserPage from './components/Pages/UserPage.jsx';
import Book from './components/Pages/Book.jsx'
import "bootstrap/dist/css/bootstrap.min.css"
import { Provider } from 'react-redux';
import store from './store.js'
import EditPage from './components/Pages/EditPage.jsx';
import AddBook from './components/Pages/AddBook.jsx';
import SearchPage from './components/Pages/SearchPage.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <ScrollToTop><Root /></ScrollToTop>,
    errorElement: <ScrollToTop><ErrorPage /></ScrollToTop>,
    children: [
      {
        index: true, element: <ScrollToTop><Home /></ScrollToTop>
      },
      {
       path: "about",
       element:  
       <>
       <ScrollToTop>
         <About /> 
       </ScrollToTop>
            
     </>
      },
      {
        path: "contact",
        element:  
        <>
        <ScrollToTop>
            <Contact />
        </ScrollToTop>
       
      </>
       },
       {
        path: "login",
        element:  
        <>
        <ScrollToTop>
          <LoginPage /> 
        </ScrollToTop>
             
      </>
       },
       {
        path: "register",
        element:  
        <>
        <ScrollToTop>
          <RegisterPage /> 
        </ScrollToTop>
             
      </>
       },
       {
        path: "books",
        element:  
        <>
        <ScrollToTop>
          <Books /> 
        </ScrollToTop>
             
      </>
       },
       {
        path: "userpage/:userId",
        element:  
        <>
        <ScrollToTop>
          <UserPage /> 
        </ScrollToTop>
             
      </>
       },
       {
        path: "book/:bookId",
        element:  
        <>
        <ScrollToTop>
          <Book /> 
        </ScrollToTop>
             
      </>
       },
       {
        path: "editbook/:bookId",
        element:  
        <>
        <ScrollToTop>
          <EditPage /> 
        </ScrollToTop>
             
      </>
       },
       {
        path: "addbook",
        element:  
        <>
        <ScrollToTop>
          <AddBook /> 
        </ScrollToTop>
             
      </>
       },
       {
        path: "search",
        element:  
        <>
        <ScrollToTop>
          <SearchPage /> 
        </ScrollToTop>
             
      </>
       },
]
},
]);



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <Provider store={store}> 
    <RouterProvider router={router} />
  </Provider>
</React.StrictMode>,
)
