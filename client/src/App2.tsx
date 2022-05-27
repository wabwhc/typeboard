import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Body from './Body';
import Subjectlist from './Subjectlist';
import Article from './Article';
import App from './App'
import Login from './Login';
import Profile from './Profile';
function App2() {
  return (
    //로그인과 아닌페이지 구분
    <Routes>
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/*" element={<App/>}/>      
    </Routes>
  );
}

export default App2;
