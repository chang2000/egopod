import './App.css';
import React, { useState, useEffect} from 'react';
function App() {

  const [apiResponse, SetApiResponse] = useState()
  const callAPI = () => {
    fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => SetApiResponse(res))
  }

  useEffect(()=>{
    callAPI()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
      <p className="App-intro">apiResponse</p>
    </div>
  );
}

export default App;
