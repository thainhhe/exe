import { combineReducers, createStore } from 'redux';
import AccountReducer from '../reducers/Account.reducer'; // Example import, adjust to your structure
import UserReducer from '../reducers/User.reducer';
import cartReducer from '../reducers/Cart.reducer';

const rootReducer = combineReducers({
  AccountReducer,
  UserReducer,
  cartReducer,
});

export type RootState = ReturnType<typeof rootReducer>; // This creates the RootState type

// Thiết lập kiểu dispatch tùy chỉnh
export type AppDispatch = typeof store.dispatch;

const store = createStore(rootReducer);

export default store;
