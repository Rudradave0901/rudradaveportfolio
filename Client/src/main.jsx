// Node Modules
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
// Components
import App from './App.jsx';
// CSS Links
import './index.css'
import 'lenis/dist/lenis.css'

import { AuthProvider } from './context/AuthContext.jsx';
import { LoadingProvider } from './context/LoadingContext.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoadingProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LoadingProvider>
  </BrowserRouter>
);
// 101923869012