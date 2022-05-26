import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Body from './Body';
import Subjectlist from './Subjectlist';
import Article from './Article';
import App from './App'
import Login from './Login';
function App2() {
  return (
    <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/*" element={<App/>}/>      
    </Routes>
  );
}

export default App2;
