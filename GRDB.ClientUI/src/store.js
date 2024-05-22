import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../src/components/redux/reducers/index'; 

const store = configureStore({
  reducer: rootReducer,
});

export default store;
