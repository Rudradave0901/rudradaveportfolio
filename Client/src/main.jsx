// Node Modules
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
// Components
import App from './App.jsx';
// CSS Links
import './index.css'
import 'lenis/dist/lenis.css'

import { AuthProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
// 101923869012