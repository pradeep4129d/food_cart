import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {BrowserRouter} from "react-router-dom";
import Header from './components/Header.jsx';
import Context from './context/store.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Context>
    <Header/>
    <App />
    </Context>
    </BrowserRouter>
  </React.StrictMode>,
)
