const initialState = {
    isLoggedIn: false,
    user: null,
    token:null,
    expiration:null
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN':
        return {
          ...state,
          isLoggedIn: true,
          user: action.payload.user,
          token: action.payload.token,
          expiration: action.payload.expiration
        };
      case 'LOGOUT':
        return {
          ...state,
          isLoggedIn: false,
          user: null,
          token: null,
          expiration: null
        };
      default:
        return state;
    }
  };
  
  export default authReducer;