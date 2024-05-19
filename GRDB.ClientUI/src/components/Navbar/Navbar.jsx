
import { Container, Nav, Navbar, NavItem, NavLink } from 'react-bootstrap';
import './Navbar.css'; 
import logo from '../../assets/png/logo-no-background.png'
import { useNavigate } from 'react-router-dom';
import { useEffect,useState} from 'react';
import getUserInfo from '../Functions/GetUserInfo';
import { useSelector,useDispatch } from 'react-redux';
import { login,logout } from '../redux/actions/authActions';
import { FaUserCheck } from "react-icons/fa";
import { Link } from 'react-router-dom';


const NavbarComponent = () => {

const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
const user = useSelector(state => state.auth.user)
const dispatch = useDispatch();
const [dropdownOpen, setDropdownOpen] = useState(false);

const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

useEffect(() => {
  const userData = sessionStorage.getItem('userData');
  if (userData) {
    dispatch(login(JSON.parse(userData)));
  }
  else{
    dispatch(logout());
  }
}, []);

    const navigate = useNavigate();  
    const handleLogin = () => {
      navigate('/Login');         
    };

    const handleLogout = () => { // Define handleLogout function
      dispatch(logout()); // Dispatch the logout action
    };
 //console.log(user)
    return (
        <Navbar bg="light" expand="lg" className="shadow-sm navbar">
            <Container>
                <Navbar.Brand href="/">
                    <img src={logo} className='navbar-logo' alt="" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {isLoggedIn ? (
                        <Nav className="ms-auto px-5">
                        <NavItem>
                            <NavLink href="/" className='navLink'>Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/Books" className='navLink'>Books</NavLink>
                        </NavItem>
                        <NavItem>
                        <NavLink href="/addbook" className='navLink'>Add Book</NavLink>
                    </NavItem>
                        <NavItem>
                            <NavLink href="/About" className='navLink'>About</NavLink>
                        </NavItem>
                    </Nav>
                    ) : (
                        <Nav className="ms-auto px-5">
                        <NavItem>
                            <NavLink href="/" className='navLink'>Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/Books" className='navLink'>Books</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/About" className='navLink'>About</NavLink>
                        </NavItem>
                    </Nav>
                    )}
                    
                    
                    <Nav className="ms-auto px-4">
                        {isLoggedIn ? (
                            <>
                            <div className='loggedin'>
                            {/* <span className="me-2 welcome">Welcome, </span> */}
                            <Link to={`/userpage/${user.id}`} className='me-2 navLink'>
                            <FaUserCheck className='user-icon' size={30} />
                            </Link>

                                <button className="login-button" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>                             
                            </>
                        ) : (
                            <button className="login-button" onClick={() => handleLogin()}>
                                Login
                            </button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
