import "./Library.css"
import "../index.css"
import React, { useState, useEffect} from 'react'
import axios from 'axios'
import store from '../store'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import apiAddress from '../config'

const Library = (props) => {
  const [userEmail, setUserEmail] = useState('')
  const [subList, setSubList] = useState([])
  const [bmList, setBmList] = useState([])

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

  const syncPlayInfo = (name, url, id, podID)=> {
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

  useEffect(()=> {
    let email = checkCookieEmail()
    if (email !== '') {
      // fetchAllSubs
      // MAGIC !!!!! ASYNC HANDLING
      let query = `${apiAddress}/api/sub/queryAll?userEmail=${email}`
      axios.get(query).then(res=>{
        let idList = res.data.subscribedIDs
        let promises = [];
        let tmpList = [];
        idList.forEach((ele)=>{
        promises.push(
          axios.get(`https://itunes.apple.com/lookup?id=${ele}&media=podcast&entity=podcastEpisode&timestamp=${new Date().getTime()}`).then(iRes => {
            // do something with response
            let bar = subPodBar(iRes.data.results[0].collectionName, iRes.data.results[0].artworkUrl100, ele)
            tmpList.push(bar);
          })
        )
        })
      Promise.all(promises).then(() => setSubList(tmpList)); 
      })

      // fetch the bookmark info
      query = `${apiAddress}/api/bm/queryAll?userEmail=${email}`
      axios.get(query).then(res=>{
        console.log(res.data.subscribedIDs)
        let list = res.data.subscribedIDs
        let promises = [];
        let tmpList = [];
        list.forEach((ele)=>{
          promises.push(
            axios.get(`https://itunes.apple.com/lookup?id=${ele.podcastID}&media=podcast&entity=podcastEpisode&timestamp=${new Date().getTime()}`).then(r=>{
              let count = r.data.resultCount - 1
              for (let i = 0; i < count; i++){
                if ((r.data.results[i+1].trackId).toString() === ele.episodeID){
                  let b = bmBar(r.data.results[0].collectionName,
                    r.data.results[0].artworkUrl100,
                    ele.podcastID,
                    ele.episodeID,
                    r.data.results[i+1].trackName)
                  tmpList.push(b)
                  break
                }
              }
            })
          )
        })
      Promise.all(promises).then(() => setBmList(tmpList)); 
        
      })
      
    } else {
      console.log("not logged in") 
    }
  }, [])

  const checkCookieEmail = () => {
    let cookieUserEmail = getCookie("userEmail")
    if (cookieUserEmail !== "" ) {
      setUserEmail(cookieUserEmail)
    }
    return cookieUserEmail
  }
  

  const jumpToPodInfo = (podID) => {
    console.log('clicked podid is', podID)
    window.localStorage.setItem("jump-from-library", "true")
    window.localStorage.setItem("podid-jump", podID);
  }

  const jumpToPlay = (podID, epID) => {
    // Access Url and Name  
    axios.get(`https://itunes.apple.com/lookup?id=${podID}&media=podcast&entity=podcastEpisode&timestamp=${new Date().getTime()}`).then(r=>{
      let count = r.data.resultCount - 1
      let name
      let url
      for (let i = 0; i < count; i++){
        if ((r.data.results[i+1].trackId).toString() === epID){
          console.log('found')
          name = r.data.results[i+1].trackName
          url = r.data.results[i+1].episodeUrl
          syncPlayInfo(name, url, epID, podID)
          break
        }
      } 
    })




  }

  const subPodBar = (podName, coverUrl, podID) => {
    return (
      <Link to="/explore" className='link-to'>
        <div className='sub-pod-bar' 
          onClick={()=>{jumpToPodInfo(podID)}}>
          <img className='sub-pod-img'  src={coverUrl} alt=""/>
          <div className='sub-pod-title'>
            {podName}
          </div>
        </div>
      </Link>
    )
  }

  const bmBar = (podName, coverUrl, podID, epID, title) => {
    return (
      <div className='sub-pod-bar' 
        onClick={()=>{jumpToPlay(podID, epID)}}>
        <img className='sub-pod-img'  src={coverUrl} alt=""/>
        <div className='text-block'>

          <div className='bm-title'>
            {title}
          </div>
          <div className='bm-name'>
            {podName}
          </div>
        </div>

      </div>
    )
  }


  return (
    <div className='library-page'>
      <div className='lib-sub'>
        <div className='lib-sub-header'>
          My Subscription
        </div>

        <div className='lib-sub-list'>
          {
          subList.map((item, key) =>(
          <div key={key}>{item}</div>)
          )}
        </div>
      </div>

      <div className='lib-bm'>
        <div className='lib-sub-header'>
          Bookmark tab
        </div>

        <div className='lib-bm-list'>
          {
          bmList.map((item, key) =>(
          <div key={key}>{item}</div>)
          )}
        </div>
      </div>

    </div>
  )
}


export default Library