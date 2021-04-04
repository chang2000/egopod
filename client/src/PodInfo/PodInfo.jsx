import './PodInfo.css'
import '../index.css'
import React, { useState, useEffect} from 'react'
import axios from 'axios'
import store from '../store'


const PodInfo = (props) =>{
  const podCoverUrl = props.coverUrl
  const podTitle = props.podTitle
  const podPub = props.podPub
  const podID = props.podID
  const userEmail = store.getState().coreStore[3]
  const [epListNames, setEpListNames] = useState([])
  const [epListUrls, setEpListUrls] = useState([])
  const [playBarList, setPlayBarList] = useState([])
  const [subscribed, setSubscribed] = useState(false)

  useEffect(()=>{
    // Fetch the episodes list
    let itunesLink = `https://itunes.apple.com/lookup?id=${podID}&media=podcast&entity=podcastEpisode&timestamp=${new Date().getTime()}`
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
    // Check wether this podcast is subscribed
    console.log('userEmail is', userEmail)
    if (userEmail !== '') {
      let query = `http://localhost:5000/api/sub/queryAll?userEmail=${userEmail}`
      console.log(query)
      axios.get(query).then((res)=>{
        let subList = res.data.subscribedIDs
        console.log(subList)
        let found = subList.indexOf(podID.toString())
        console.log(found)
        if (found === -1) {
          setSubscribed(false)
        } else {
          setSubscribed(true)
        }

      })

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=>{
    generatePlayBarList()
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    let query = `http://localhost:5000/api/sub/addsub?podcastID=${podID}&userEmail=${userEmail}`
    console.log(query)
    axios.get(query).then(res=>{
      setSubscribed(true)
    })
  }

  const unSubscribePodcast = () => {
    let query = `http://localhost:5000/api/sub/unsub?podcastID=${podID}&userEmail=${userEmail}`
    console.log(query)
    axios.get(query).then(res=>{
    setSubscribed(false)
    })
  }

  return (
    <div className="pod-info-page">
      <div className="info-left-card">
        <img className='info-left-card-img' 
          alt=""
          src= {podCoverUrl} />

        <div className='info-left-card-title'>
          {podTitle}
        </div> 

        <div className='info-left-card-pub'>
          {podPub}
        </div>

        {
          subscribed === false ? 
          <div className='info-left-sub noselect'
            onClick={subscribePodcast}
          >
            Subscribe
          </div>
          : 
          <div className='info-left-sub noselect'
            onClick={unSubscribePodcast}
          >
            UnSubscribe
          </div>
        }
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