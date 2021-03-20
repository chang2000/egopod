import './Explore.css'
import React, { useState, useEffect} from 'react'
import best from './Best-podcast'
import {Card} from 'react-bootstrap'


const Explore = () =>{

    const [podlist, setPodlist] = useState([])

    useEffect(()=>{
    let bestObj = best
    let reslist = []
    for (let i = 0; i < 20; i ++) {
        let name = bestObj.podcasts[i].title
        let url = bestObj.podcasts[i].thumbnail
        let pub = bestObj.podcasts[i].publisher
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