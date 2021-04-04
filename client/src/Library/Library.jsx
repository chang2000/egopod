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
      fetchSubs(email)
    } else {
      console.log("not logged in") 
    }
  }, [])

   const fetchSubs = async (email) =>{
    let query = `http://localhost:5000/api/sub/queryAll?userEmail=${email}`
    let tmp = []
    await axios.get(query).then(res=>{
      let idList = res.data.subscribedIDs
      idList.forEach((ele)=>{
        let bar = fetchSingleInfo(ele)
        subList.push(bar)
        console.log(subList)
        setSubList(subList)        
      })
    })

  }

  const fetchSingleInfo = async (ele) => {
    let itunesLink = `https://itunes.apple.com/lookup?id=${ele}&media=podcast&entity=podcastEpisode&timestamp=${new Date().getTime()}`
    let bar
    await axios.get(itunesLink).then(iRes=>{
      console.log(iRes.data.results[0].collectionName)
      bar = subPodBar(iRes.data.results[0].collectionName, iRes.data.results[0].artworkUrl100, ele)
    })
    return bar
  }

  const jumpToPodInfo = (podID) => {
    console.log('clicked podid is', podID )
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