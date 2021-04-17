import './NotesViewer.css'
import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { set } from 'draft-js/lib/DefaultDraftBlockRenderMap'


const NotesViewer = (props) =>{
  const userEmail = props.userEmail 
  const episodeID = props.episodeID 
  const podcastID = props.podcastID
  const [noteList, setNoteList] = useState([])
  const [elementList, setElementList] = useState([])
  useEffect(()=>{
    // Query for all the notes
    let apiString = `http://16.162.28.154:5000/api/note/queryAll?userEmail=${userEmail}`
    let tmpList = []
    console.log("ep id is", episodeID)
    axios.get(apiString).then((res)=>{
      // console.log(res.data.Note)
      
      let len = res.data.Note.length
      console.log(len)
      for (let i = 0; i < len; i++) {
        if (res.data.Note[i].episodeID === episodeID) {
          tmpList.push(res.data.Note[i])
        }
      }
      console.log(tmpList)
      
      setNoteList(tmpList)
    })
  }, [])

  useEffect(()=>{
    renderNoteList()
  }, [noteList])


  const noteBar = (noteString, timeStamp) => {
    let string = noteString.substr(0, 20)
    return (
      <div className="notebar">
        <div className="note_string_sub">
          {string}      
        </div>

        <div className='time_stamp'>
          {timeStamp}
        </div>
        <button>D</button>
        <button>T</button>

      </div>
    )
  }


  const renderNoteList = () => {
    let list = []
    for (let i = 0; i < noteList.length; i++) {
      console.log(noteList[i].timeStamp)
      let bar = noteBar(noteList[i].noteString, noteList[i].timestamp)
      list.push(bar)
    }
    console.log(list)
    setElementList(list)
    
  }


  return (
    <div className="viewer">
      {
      elementList.map((item, key) =>(
      <div key={key}>{item}</div>)
      )}

    </div>
  )
}



export default NotesViewer;