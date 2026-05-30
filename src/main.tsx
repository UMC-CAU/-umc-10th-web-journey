import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Provider로 감싸 모든 컴포넌트에서 Redux store에 접근 가능하게 함 */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
