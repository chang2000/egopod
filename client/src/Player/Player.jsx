import './Player.css'
import React, { useState, useEffect} from 'react'
// import best from './Best-podcast'
// import podData from './Podcast-data'
import axios from 'axios'



const Player = () =>{

  const [playURL, setPlayURL] = useState([])

  useEffect(()=>{
    setPlayURL('https://dts.podtrac.com/redirect.mp3/chtbl.com/track/8DB4DB/pdst.fm/e/nyt.simplecastaudio.com/bbbcc290-ed3b-44a2-8e5d-5513e38cfe20/episodes/4366b28f-0681-4a3f-80da-748f36e81c12/audio/128/default.mp3?awCollectionId=bbbcc290-ed3b-44a2-8e5d-5513e38cfe20&awEpisodeId=4366b28f-0681-4a3f-80da-748f36e81c12')
  },[])
        

  return (
    <div className="core-player buttom-sticky">
      <div className="bottom-play-control">
      This is player bar
      </div>
    </div>
  )
}



export default Player;