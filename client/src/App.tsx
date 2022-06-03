import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import Body from './Body';
import Subjectlist from './Subjectlist';
import Article from './Article';
import Btn from './Btn';
import Write from './Write';

function App() {
  let [isLog, setisLog] = useState('Anonymous')
  let [userid, setuserid] = useState('');

  useEffect(() => {fetch('http://localhost:8080/isLogin',{
      credentials : 'include'
    }).then(e => e.json().then(e => {
      setisLog(e.userid)
      console.log(isLog)
    }))}
  )
  useEffect(()=> {
    fetch('http://localhost:8080/profileimg/' + isLog)
    .then(e => e.blob().then(imageBlob => {
      // Then create a local URL for that image and print it 
      const url = URL.createObjectURL(imageBlob);
      let profile =document.getElementById('profile');
      //img.src = url;
      profile.style.backgroundImage = `url(${url})`
  }))
  })
  //'backgroundImage' : `url(${img})`

  return (
    <div className="app">
      <div className="left">
        <div style={{
          'borderRadius' : '50%','paddingBottom' : '100%',
          'width': '100%', 'backgroundColor' : 'white', 'backgroundSize' : 'cover'
          }}
          onClick={() => {
            if(isLog === 'Anonymous'){
              window.location.href = '/login'
            }else{
              window.location.href = `/profile/${isLog}`
            }
          }} id='profile'>
        </div>
        <br />
        <h4 style={{'color' : 'white', 'textAlign' : 'center'}}>{isLog}</h4>
      </div>
      <div className="middle">
        <div id="head" style={{'color' : 'white', 'textAlign' : 'center'}}><h1>게시판</h1></div>
        <Routes>
          <Route path="/" element={<Body />}/>
          <Route path="/write/:subject" element={<Write />}/>
          <Route path="/article/:id" element={<Article isLog={isLog} setuserid={setuserid}/>}/>
          <Route path="/:subject" element={<Body />}/>
        </Routes>
      </div>
      <div className="right">
      {
        isLog !== 'Anonymous' ? <button onClick={() => fetch('http://localhost:8080/logout', {credentials : 'include'}).then(() => setisLog('Anonymous'))}>로그아웃</button>
        : 
        <button onClick={() => window.location.href = '/login'}>로그인/회원가입</button>
      }
      <Routes>
          {
            userid === isLog && userid !== 'Anonymous'&&<Route path="/article/:id" element={<Btn />}/>
          }
          <Route path="/:subject" element={<Btn />}/>
      </Routes>
        <Subjectlist />
      </div>
    </div>
  );
}

export default App;
