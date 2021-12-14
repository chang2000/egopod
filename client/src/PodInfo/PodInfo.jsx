import './PodInfo.css'
import '../index.css'
import React, { useState, useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import store from '../store'
import clientAuthInfo from '../config'

const PodInfo = (props) =>{
  const podCoverUrl = props.coverUrl
  const podTitle = props.podTitle
  const podPub = props.podPub
  const podID = props.podID
  const userEmail = store.getState().coreStore[3]
  const [epListNames, setEpListNames] = useState([])
  const [epListUrls, setEpListUrls] = useState([])
  const [epIDs, setEpIDs] = useState([])
  const [playBarList, setPlayBarList] = useState([])
  const [subscribed, setSubscribed] = useState(false)

  useEffect(()=>{
    // Fetch the episodes list
    let itunesLink = `https://itunes.apple.com/lookup?id=${podID}&media=podcast&entity=podcastEpisode&timestamp=${new Date().getTime()}`
    // Query
    axios.get(itunesLink).then(res=>{
      let tmpNames = []
      let tmpUrls = []
      let tmpIDs = []

      let n_episodes = res.data.resultCount - 1
      for (let j = 0; j < n_episodes; j++) {
        tmpNames.push(res.data.results[j+1].trackName)
        tmpUrls.push(res.data.results[j+1].episodeUrl)
        tmpIDs.push(res.data.results[j+1].trackId)
      }
      setEpListNames(tmpNames)
      setEpListUrls(tmpUrls)
      setEpIDs(tmpIDs)
    })
    // Check wether this podcast is subscribed
    if (userEmail !== '') {
      let query = `${clientAuthInfo.apiAddress}/api/sub/queryAll?userEmail=${userEmail}`
      axios.get(query).then((res)=>{
        let subList = res.data.subscribedIDs
        let found = subList.indexOf(podID.toString())
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
  }, [epListNames, epListUrls, epIDs])

  const syncPlayInfo = (e, name, url, id)=> {
    console.log(name, url, podID, id)
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
    store.dispatch({
      type: 'updateEpisodeID',
      payload: id
    })
  }

  const episodeBar =(name, url, id)=>{
    return (
    <div className="single-play-bar"
        onClick={(e)=>{
          syncPlayInfo(e, name, url, id)
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
      tmplist.push(episodeBar(epListNames[i], epListUrls[i], epIDs[i]))
    }
    setPlayBarList(tmplist)
  }

  const subscribePodcast = () => {
    if (userEmail === '') {
      toast("Please Signin")
    } else {
      let query = `${clientAuthInfo.apiAddress}/api/sub/addsub?podcastID=${podID}&userEmail=${userEmail}`
      axios.get(query).then(res=>{
        setSubscribed(true)
      })
    }
  }

  const unSubscribePodcast = () => {
    let query = `${clientAuthInfo.apiAddress}/api/sub/unsub?podcastID=${podID}&userEmail=${userEmail}`
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
          <div className='info-left-sub noselect not_sub'
            onClick={subscribePodcast}
          >
            Subscribe
          </div>
          : 
          <div className='info-left-sub noselect subed'
            onClick={unSubscribePodcast}
          >
            Subscribed
          </div>
        }
      </div>

      <div className="info-podlist">
      {
        playBarList.map((item, key) =>(
        <div key={key}>{item}</div>)
      )}
      </div>
      <ToastContainer />
    </div>
    
  )
}



export default PodInfo;