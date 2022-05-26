import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Body from './Body';
import Subjectlist from './Subjectlist';
import Article from './Article';
import Btn from './Btn';


function App() {
  let [isLog, setisLog] = useState(false)

  useEffect( () => {fetch('http://localhost:8080/isLogin',{
      method:'post',
      credentials : 'include'
    }).then(e => e.text().then(e => {
      console.log(e)
      if(e !== ""){
        setisLog(true)
      }else{
        setisLog(false)
      }
      console.log(isLog)
    }))}
  )

  return (
    <div className="app">
      <div className="left"></div>
      <div className="middle">
        <div id="head"></div>
        <div id="search">
        </div>
        <Routes>
          <Route path="/" element={<Body/>}/>
          <Route path="/article/:id" element={<Article/>}/>
          <Route path="/:subject" element={<Body/>}/>
        </Routes>
      </div>
      <div className="right">
      {
        isLog ? <button onClick={() => fetch('http://localhost:8080/logout', {credentials : 'include'}).then(() => setisLog(false))}>로그아웃</button>
        : 
        <button onClick={() => window.location.href = '/login'}>로그인</button>
      }
      <Routes>
          <Route path="/" element={<Btn/>}/>
          <Route path="/article/:id" element={<Btn/>}/>
          <Route path="/:subject" element={<Btn/>}/>
      </Routes>
        <Subjectlist />
      </div>
    </div>
  );
}

export default App;
