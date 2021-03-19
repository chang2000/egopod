import './App.css';
import React, { useState, useEffect} from 'react';
import axios from 'axios'
import GoogleLogin from 'react-google-login'

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

  // Check cookie
  useEffect(()=>{
    let cookieUserName = getCookie("userName")
    let cookieUserEmail = getCookie("userEmail")
    if (cookieUserName !== "" ) {
      setUserName(cookieUserName)
      setUserEmail(cookieUserEmail)
    }
  }, []) 

  useEffect(()=>{
    if(userName !== '') {
      setIsloggedin(true)
    }
  }, [userName])

  const getCookie = (cname)=> {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
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
      document.cookie = `userName=${res.data.userName}`
      document.cookie = `userEmail=${res.data.userEmail}`
    })
  };
  
  function Library() { // will be written in another componment file
    return <h2>Library</h2>;
  }
  
  function Explore() {// will be written in another componment file
    return <h2>Explore</h2>;
  }


  return (
    <div className="App">
    <Router>
      <header className="App-header">
        <div className="logoTxt">EgoPod</div>
          <div className="header-navigator">
          <div
            className={"navigator-card"}
            id = "library-tab"
          >
            <Link to="/library" 
              style={{color: 'white', textDecoration: 'none'}} 
               >Library</Link>
          </div>

          <div
            className="navigator-card"
            id = "explore-tab"
          >
            <Link to="/explore" 
              style={{color: 'white', textDecoration: 'none'}} 
              >Explore</Link>
          </div>
        </div>
        {
          isloggedin ? 
            <div className='header-welcome'>Hi, {userName}</div> // May be we can use something like Morning, Afternoon.. here
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
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
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
    </Router>
      

    </div>
  );
}

export default App;
