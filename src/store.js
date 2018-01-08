import { createStore } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

const user = (state = {
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
      break;
    default: return state;
  }
};

const initialGameState = {
  opponent: null,
  winner: null,
  totalCount: 0,
  gameId: null
};

const game = (state = initialGameState, action) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        gameId: action.payload.gameId
      };
      break;
    case "START_FIGHT":
      return {
        ...state,
        opponent: action.payload.opponent
      };
      break;
    case "CHOOSE_GAME":
      return {
        ...state,
        gameId: action.payload.gameId
      };
      break;
    case "SET_OPPONENT":
      return {
        ...state,
        opponent: action.payload.opponent
      };
      break;
    case "SET_COUNT":
      return {
        ...state,
        totalCount: action.payload.count
      };
      break;
    case "RESET":
      return initialGameState;
      break;
    default: return state;
  }
};

const config = {
  key: "root",
  storage
};

const store = createStore(persistCombineReducers(config, { user, game }));

persistStore(store, null, () => {
  store.getState();
});

export default store;
