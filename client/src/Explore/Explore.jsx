import React, { useState, useEffect} from 'react'
import '../index.css'
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

        
    const presen_pod = (name, thumbnail, pub, id)=>{
        return (
        <Card style={{ width: '14rem', margin: '1rem' }}>
        <Card.Img variant="top" src={thumbnail} />
        <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>
                {pub}
            </Card.Text>
        </Card.Body>
        </Card>
        )
    }

    return (
        <div>
            {
            podlist.map((item, key) =>(
                <div key={key}>{item}</div>)
            )}
        </div>
    )
}



export default Explore;