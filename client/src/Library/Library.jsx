import "./Library.css"
import React, { useState, useEffect} from 'react'
import axios from 'axios'
import store from '../store'

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

  const checkCookieEmail = () => {
    let cookieUserEmail = getCookie("userEmail")
    if (cookieUserEmail !== "" ) {
      setUserEmail(cookieUserEmail)
    }
    return cookieUserEmail
  }
  
  useEffect(()=> {
    let email = checkCookieEmail()
    if (email !== '') {
      // fetchAllSubs
      // MAGIC !!!!! ASYNC HANDLING
      let query = `http://localhost:5000/api/sub/queryAll?userEmail=${email}`
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
      query = `http://localhost:5000/api/bm/queryAll?userEmail=${email}`
      axios.get(query).then(res=>{
        console.log(res.data.subscribedIDs)
        let list = res.data.subscribedIDs
        let promises = [];
        let tmpList = [];
        list.forEach((ele)=>{
          promises.push(
            axios.get(`https://itunes.apple.com/lookup?id=${ele.podcastID}&media=podcast&entity=podcastEpisode&timestamp=${new Date().getTime()}`).then(r=>{
              console.log(r.data)
              let count = r.data.resultCount - 1
              for (let i = 0; i < count; i++){
                if ((r.data.results[i+1].trackId).toString() === ele.episodeID){
                  console.log("found")
                  let b = bmBar(r.data.results[0].collectionName,
                    r.data.results[0].artworkUrl100,
                    ele.podcastID,
                    ele.episodeID,
                    r.data.results[i+1].trackName)
                  tmpList.push(b)
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



  const jumpToPodInfo = (podID) => {
    console.log('clicked podid is', podID )
  }

  const jumpToPlay = (podID, epID) => {
    console.log('podID, epID', podID, epID)
  }

  const subPodBar = (podName, coverUrl, podID) => {
    return (
      <div className='sub-pod-bar' 
        onClick={()=>{jumpToPodInfo(podID)}}>
        <img className='sub-pod-img'  src={coverUrl} alt=""/>
        <div className='sub-pod-title'>
          {podName}
        </div>
      </div>
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