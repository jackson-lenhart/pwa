import { Provider } from 'preact-redux';

import './style';
import App from './components/app';
import store from './store';

const Main = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Main;
