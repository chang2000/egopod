import './Explore.css'
import React, { useState, useEffect} from 'react'
import best from './Best-podcast'
import podData from './Podcast-data'
import axios from 'axios'



const Explore = () =>{

  const [podlist, setPodlist] = useState([])

  useEffect(()=>{
    // Fetch the best podcast
    // let options ={
    //   url: 'https://listen-api.listennotes.com/api/v2/best_podcasts?safe_mode=1',
    //   headers: {
    //     'X-ListenAPI-Key': '4bd7fbe1b5014b2482f0ecd1f2a8ba4f'
    //   }
    // }
    // let options ={
    //   url: 'https://listen-api.listennotes.com/api/v2/podcasts/d006ad88df054cdb8dc8e1d816cfd8b8?next_episode_pub_date=1479154463000&sort=recent_first',
    //   headers: {
    //     'X-ListenAPI-Key': '4bd7fbe1b5014b2482f0ecd1f2a8ba4f'
    //   }
    // }

    // axios(options).then(res =>{
    //   console.log(res)
    // })

  // response.toJSON();

    let bestObj = best
    let reslist = []
    for (let i = 0; i < 12; i ++) {
      let name = bestObj.data.podcasts[i].title
      let url = bestObj.data.podcasts[i].image
      let pub = bestObj.data.podcasts[i].publisher
      let id = i
      reslist.push(presen_pod(name, url, pub, id))
    }
    setPodlist(reslist)
  },[])
        
  const presen_pod = (name, url, pub, id)=>{
    return (
    <div className="card">
      <img className="card-image"
        src={url} />
      <div className="card-title">
        {name}
      </div>
      <div className="card-desc">
        {pub}
      </div>
    </div>
    )
}

  return (
    <div className="podGallery">
      {
      podlist.map((item, key) =>(
        <div className="outterCard" key={key}>{item}</div>)
      )}
    </div>
  )
}



export default Explore;