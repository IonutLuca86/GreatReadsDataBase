

export const login = (userData) => {
  sessionStorage.setItem('userData', JSON.stringify(userData));

 
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



  