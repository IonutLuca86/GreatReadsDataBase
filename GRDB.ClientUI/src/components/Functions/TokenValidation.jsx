import { useNavigate } from "react-router-dom";


export default function tokenValidation(navigate) {
    
  
    try {
        const storedUserInfo = sessionStorage.getItem('userData');
        const info = JSON.parse(storedUserInfo);
        const expiration = new Date(info.expiration);
        const currentTime = new Date();
        if(expiration > currentTime){
            return info.token;
        }    
        else{
            alert("Your login session has expired! Plase login again!")
            sessionStorage.clear();
            navigate('/login');
        }
    } catch (error) {
        console.log("Error parsing user info:", error);
        return null; 
    }

}