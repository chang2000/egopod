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

  const [apiResponse, SetApiResponse] = useState()
  useEffect(()=>{
    callAPI()
  }, [])
  const callAPI = () => {
    fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => SetApiResponse(res))
  }


  const responseGoogle = (response) => {
    console.log(response);
    axios({
      method: "POST",
      url: "http://localhost:9000/api/googlelogin",

    }).then(response => {
      console.log(response)
    })
  };
  
  function Library() {
    return <h2>Library</h2>;
  }
  
  function Explore() {
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


        <GoogleLogin
          className="loginBtn"
          clientId="81834534286-ksipb13ampj692eia95sqaed3r67jeje.apps.googleusercontent.com" // Secret
          buttonText="Singin with google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
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
