import './App.css'
import './index.css'
import React, { useState, useEffect} from 'react'
import Explore from "./Explore/Explore"
import Library from "./Library/Library"
import PlayingPanel from "./PlayingPanel/PlayingPanel"
import axios from 'axios'
import GoogleLogin from 'react-google-login'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import store from './store'
// For the switching animation effect

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function App() {
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [isloggedin, setIsloggedin] = useState(false)
  const [audioUrl, setAudioUrl] = useState('')
  const [playingTitle, setPlayingTitle] = useState('Not Playing')
  const [showPlayingPanel, setShowPlayingPanel] = useState(false)

  // Check cookie
  useEffect(()=>{
    let cookieUserName = getCookie("userName")
    let cookieUserEmail = getCookie("userEmail")
    if (cookieUserName !== "" ) {
      setUserName(cookieUserName)
      setUserEmail(cookieUserEmail)
    }

    store.subscribe(resetPlayingUrl)
    store.subscribe(resetPlayingName)
  }, []) 

  useEffect(()=>{
    if(userName !== '') {
      setIsloggedin(true)
    }
  }, [userName])

  useEffect(()=>{
    console.log('Change Playing Url', audioUrl)
  }, [audioUrl])

  useEffect(()=>{
    console.log('Change playing title', playingTitle)
  }, [playingTitle])

  useEffect(()=>{
    console.log('playing panel state changed')
  }, [showPlayingPanel])

  const resetPlayingName = () =>{
    let name = store.getState().coreStore[0]
    setPlayingTitle(name)
  }

  const resetPlayingUrl = () =>{
    let url = store.getState().coreStore[1]
    setAudioUrl(url)
  }


  const setCookie = (cname, cvalue, exdays) => {
    let d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    let expires = "expires="+d.toUTCString()
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
  }

  const getCookie = (cname)=> {
    let name = cname + "="
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';')
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ""
  }

  const responseGoogle = (response) => {
    axios({
      method: "POST",
      url: "http://localhost:5000/api/googlelogin",
      data: {tokenId: response.tokenId}
    }).then(res => {
      setUserName(res.data.userName)
      setUserEmail(res.data.userEmail)
      console.log(res.data.userName)
      console.log(res.data.userEmail)
      // Set up Cookie here
      setCookie('userName', res.data.userName, 3)
      setCookie('userEmail', res.data.userEmail, 3)
    })
  };
  
  const logout = () =>{
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUserName('') 
    setUserEmail('')
    setIsloggedin(false)
  }

  const downloadFile = () =>{
  let link = document.createElement("a");
    link.download = 'audio.mp3';
    link.href = audioUrl;
    link.target ='_blank'
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } 

  const switchPlayingDetailPanel = () => {
    if (playingTitle !== 'Not Playing') {
      setShowPlayingPanel(!showPlayingPanel)
    }
  }

  return (
    <div className="App">
    <Router>
      <header className="App-header sticky noselect">
        <div className="logoTxt">EgoPod</div>
          <div className="header-navigator">
          <div
            className={"navigator-card"}
            id = "library-tab"
          >
            <Link to="/library" 
              className="navi-section"
              style={{color: 'white', textDecoration: 'none'}} 
               >Library</Link>
          </div>

          <div
            className="navigator-card"
            id = "explore-tab"
          >
            <Link to="/explore" 
              className="navi-section"
              style={{color: 'white', textDecoration: 'none'}} 
              >Explore</Link>
          </div>
        </div>
        {
          isloggedin ? 
            <div className="welcome-user" 
            >
              Hi, {userName}
            <div className="loggin-dropdown-menu">
              <div className="dropdown-button"
                onClick={logout}
              >
                Sign out
              </div>
            </div> 
            
            </div> // May be we can use something like Morning, Afternoon.. here

          :
            <GoogleLogin
            className="loginBtn"
            clientId="81834534286-ksipb13ampj692eia95sqaed3r67jeje.apps.googleusercontent.com" // Secret
            buttonText="Singin with google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
          />
        }

      </header>
      {showPlayingPanel ? 
        <PlayingPanel />
      : 
      <div>
        <Switch>
          <Route path="/library">
            <Library />
          </Route>
          <Route path="/explore">
            <Explore />
          </Route>
          <Route path="/">
            <Explore />
          </Route>
        </Switch>
      </div>
      }
        <div className='playing-title'>
          <div className='playing-title-text'
            onClick={switchPlayingDetailPanel}>
            {playingTitle}
          </div>
          {playingTitle !== 'Not Playing' ?
          <button onClick={downloadFile}>Download</button>
          :
          <div></div>
          }
        </div>
      <AudioPlayer
        className='core-player'
        src={audioUrl}
        customAdditionalControls={[]}
      />
    </Router>
    </div>
  );
}

export default App;
