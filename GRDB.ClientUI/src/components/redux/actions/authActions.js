

export const login = (userData) => {
  // Save user data to session storage
  sessionStorage.setItem('userData', JSON.stringify(userData));

  // Return an action object
  return {
    type: 'LOGIN',
    payload: userData,
  };
};
  
  export const logout = () => {
    sessionStorage.removeItem('userData');
    return{
      type: 'LOGOUT',
    }    
  };



  