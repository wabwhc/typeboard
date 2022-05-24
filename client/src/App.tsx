import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Body from './Body';
import Subjectlist from './Subjectlist';
function App() {
  return (
    <div className="app">
      <div className="left"></div>
      <div className="middle">
        <div id="head"></div>
        <div id="search">
        </div>
        <Routes>
          <Route path="/" element={<Body/>}/>
          <Route path="/:subject" element={<Body/>}/>
        </Routes>
      </div>
      <div className="right">
        <Subjectlist />
      </div>
    </div>
  );
}

export default App;
