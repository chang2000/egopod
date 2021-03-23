import './Explore.css'
import React, { useState, useEffect} from 'react'
import best from './Best-podcast'
import podData from './Podcast-data'
import axios from 'axios'
import PodInfo from '../PodInfo/PodInfo'



const Explore = () =>{

  const [podlist, setPodlist] = useState([])
  const [showExplore, setShowExplore] = useState(true)
  const [podCoverUrl, setPodCoverUrl] = useState()
  const [podTitle, setPodTitle] = useState()
  const [podPub, setPodPub] = useState()
  const [podID, setPodID] = useState()

  useEffect(()=>{
    let bestObj = best
    let reslist = []
    // Embed a apple url to it
    for (let i = 0; i < 10; i ++) {
      let itunesID = bestObj.data.podcasts[i].itunes_id
      let name = bestObj.data.podcasts[i].title
      let url = bestObj.data.podcasts[i].image
      let pub = bestObj.data.podcasts[i].publisher
      let id = itunesID
      reslist.push(presen_pod(name, url, pub, id))
    }
    setPodlist(reslist)
  },[])

  const changeToSingleView = (e, name, url, pub, id) =>{
    setPodID(id)
    setPodCoverUrl(url)
    setPodPub(pub)
    setPodTitle(name)
    setShowExplore(false)
  }

  const presen_pod = (name, url, pub, id)=>{
    return (
    <div className="card" 
         value={id}
         onClick={((e)=>{
          changeToSingleView(e, name, url, pub, id)
      })} >
      <img className="card-image"
        src={url} />
      <div className="card-title">
        {name}
      </div>
      <div className="card-pub">
        {pub}
      </div>
    </div>
    )
}

  return (
    showExplore == true?
    <div className="podGallery">
      {
      podlist.map((item, key) =>(
        <div className="outterCard" key={key}>{item}</div>)
      )}
    </div>
    :
      <PodInfo 
        coverUrl = {podCoverUrl}
        podTitle = {podTitle}
        podPub = {podPub}
        podID = {podID}
      />
  )
}



export default Explore;