import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';

const reducer = (state = {
  isLoggedIn: false,
  currentUser: null
}, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        currentUser: action.payload
      };
      break;
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        currentUser: null
      };
    default:
      return { ...state };
  }
};

const config = {
  key: "root",
  storage
};

const store = createStore(persistReducer(config, reducer));

persistStore(store, null, () => {
  store.getState();
});

export default store;
