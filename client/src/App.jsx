import './App.css'
import './index.css'
import React, { useState, useEffect} from 'react'
import Explore from "./Explore/Explore"
import axios from 'axios'
import GoogleLogin from 'react-google-login'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

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

  // Check cookie
  useEffect(()=>{
    let cookieUserName = getCookie("userName")
    let cookieUserEmail = getCookie("userEmail")
    if (cookieUserName !== "" ) {
      setUserName(cookieUserName)
      setUserEmail(cookieUserEmail)
    }
    setAudioUrl("https://hwcdn.libsyn.com/p/9/2/6/926a07b50daa5c9d/2016-11-14-StarWars7x7Show864-Tem12n.mp3?c_id=13325370&cs_id=13325370&destination_id=207880&expiration=1616407535&hwt=6d807c39f78988842b9e4aaa56b04c1a")
  }, []) 

  useEffect(()=>{
    if(userName !== '') {
      setIsloggedin(true)
    }
  }, [userName])

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

  function Library() { // will be written in another componment file
    return <div className="font-medium text-4xl text-center">Library</div>;
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
      <div>
        <Switch>
          <Route path="/library">
            <Library />
          </Route>
          <Route path="/explore">
            <Explore />
          </Route>
          <Route path="/">
            <Library />
          </Route>
        </Switch>
      </div>
        <div className='playing-title'>Star War: Title here
          <button onClick={downloadFile}>Download!</button>
        </div>
      <AudioPlayer
        className='core-player'
        src={audioUrl}
        onPlay={e => console.log("onPlay")}
        customAdditionalControls={[]}
      />
    </Router>
    </div>
  );
}

export default App;
