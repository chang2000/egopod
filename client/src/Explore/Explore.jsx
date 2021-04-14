import './Explore.css'
import React, { useState, useEffect} from 'react'
import axios from 'axios'
import PodInfo from '../PodInfo/PodInfo'
import SearchBar from "material-ui-search-bar";


const Explore = () =>{

  const [podlist, setPodlist] = useState([])
  const [showExplore, setShowExplore] = useState(true)
  const [podCoverUrl, setPodCoverUrl] = useState()
  const [podTitle, setPodTitle] = useState()
  const [podPub, setPodPub] = useState()
  const [podID, setPodID] = useState()

  useEffect(()=>{ 
  // eslint-disable-next-line react-hooks/exhaustive-deps
    // Check if it's jumped to here
    let jumpState = window.localStorage.getItem("jump-from-library")
    if (jumpState == 'true') {
      window.localStorage.setItem("jump-from-library", "false")
      console.log("YESSSSS")
      // Fetch the podinfo
      let readID = window.localStorage.getItem("podid-jump")
      // console.log(readID) 
      let itunesLink = `https://itunes.apple.com/lookup?id=${readID}&media=podcast&entity=podcastEpisode&timestamp=${new Date().getTime()}`
      axios.get(itunesLink).then(res=>{
        let url = res.data.results[0].artworkUrl600;
        let title = res.data.results[0].collectionName;
        let pub = res.data.results[0].artistName; 
        setPodPub(pub)
        setPodTitle(title)
        setPodCoverUrl(url)
        setPodID(readID)
        setShowExplore(false)
      })

    } else {
      requestSearch('tech')
    }


  },[])

  useEffect(()=>{
  }, [podlist])

  const changeToSingleView = (e, name, url, pub, id) =>{
    setPodID(id)
    setPodCoverUrl(url)
    setPodPub(pub)
    setPodTitle(name)
    setShowExplore(false)
  }
  
  const changeToExploreView = ()=> {
    setShowExplore(true)
  }

  const presen_pod = (name, url, pub, id)=>{
    return (
    <div className="card" 
         value={id}
         onClick={((e)=>{
          changeToSingleView(e, name, url, pub, id)
      })} >
      <img className="card-image"
        alt=""
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

  const requestSearch = (val) => {
    let searchUrl = `https://itunes.apple.com/search?timestamp=${new Date().getTime()}&media=podcast&term=`
    
    if (val !== '') {
     searchUrl = searchUrl + val
    } else {
      searchUrl = searchUrl + 'tech'
    }
    console.log(searchUrl)
    axios.get(searchUrl).then((res)=>{
      let resCount = res.data.resultCount
      let tmpList = []
      for (let i = 0; i < resCount; i++) {
        let name = res.data.results[i].collectionName
        let url = res.data.results[i].artworkUrl600
        let pub = res.data.results[i].artistName
        let id = res.data.results[i].collectionId
        tmpList.push(presen_pod(name, url, pub, id))
      }
      setPodlist(tmpList) 
      // console.log(res)
    })

  }

  return (
    showExplore === true?
    <div className="podGallery">
      <SearchBar 
      className='search-bar'
      value={''}
      onChange={(newval)=> requestSearch(newval) }
      onRequestSearch={(newval)=> requestSearch(newval) }
      />
      {
      podlist.map((item, key) =>(
        <div className="outterCard" key={key}>{item}</div>)
      )}
    </div>
    :
    <div>
      <div className='back-btn'
        onClick={changeToExploreView}
      >Go Back</div>
      <PodInfo 
        coverUrl = {podCoverUrl}
        podTitle = {podTitle}
        podPub = {podPub}
        podID = {podID}
      />

    </div>
  )
}



export default Explore;