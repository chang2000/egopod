import './PodInfo.css'
import React, { useState, useEffect} from 'react'
import axios from 'axios'
import store from '../store'


const PodInfo = (props) =>{
  const podCoverUrl = props.coverUrl
  const podTitle = props.podTitle
  const podPub = props.podPub
  const podID = props.podID
  const [epListNames, setEpListNames] = useState([])
  const [epListUrls, setEpListUrls] = useState([])
  const [playBarList, setPlayBarList] = useState([])

  useEffect(()=>{
    // Fetch the episodes list
    let itunesLink = `https://itunes.apple.com/lookup?id=${podID}&media=podcast&entity=podcastEpisode`
    // Query
    axios.get(itunesLink).then(res=>{
      // console.log(res)
      let tmpNames = []
      let tmpUrls = []

      let n_episodes = res.data.resultCount - 1
      for (let j = 0; j < n_episodes; j++) {
        tmpNames.push(res.data.results[j+1].trackName)
        tmpUrls.push(res.data.results[j+1].episodeUrl)
      }
      setEpListNames(tmpNames)
      setEpListUrls(tmpUrls)
    })
  }, [])

  useEffect(()=>{
    generatePlayBarList()
  }, [epListNames, epListUrls])

  const syncPlayInfo = (e, name, url)=> {
    // console.log(name, url,podID)
    store.dispatch({
      type: 'updateUrl',
      payload: url
    })
    store.dispatch({
      type: 'updateName',
      payload: name
    })
    store.dispatch({
      type: 'updatePodcastID',
      payload: podID
    })
    // console.log('dispatched')
  }

  const episodeBar =(name, url)=>{
    return (
    <div className="single-play-bar"
        onClick={(e)=>{
          syncPlayInfo(e, name, url)
        }}
     >
      <div className="single-play-bar-title">
        {name}
      </div>

    </div>)
  }

  const generatePlayBarList = ()=>{
    let length = epListNames.length
    let tmplist = []
    for (let i = 0; i < length; i++) {
      tmplist.push(episodeBar(epListNames[i], epListUrls[i]))
    }
    setPlayBarList(tmplist)
  }

  const subscribePodcast = () => {
    console.log('sub btn clicked')

  }

  return (
    <div className="pod-info-page">
      <div className="info-left-card">
        <img className='info-left-card-img' 
          src= {podCoverUrl} />

        <div className='info-left-card-title'>
          {podTitle}
        </div> 

        <div className='info-left-card-pub'>
          {podPub}
        </div>

        <div className='info-left-sub'
          onClick={subscribePodcast}
        >
          Subscribe
        </div>
      </div>

      <div className="info-podlist">
      {
        playBarList.map((item, key) =>(
        <div key={key}>{item}</div>)
      )}
      </div>
    </div>
    
  )
}



export default PodInfo;