import './NotesViewer.css'
import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { set } from 'draft-js/lib/DefaultDraftBlockRenderMap'


const NotesViewer = (props) =>{
  const userEmail = props.userEmail 
  const episodeID = props.episodeID 
  const podcastID = props.podcastID
  const audioUrl = props.audioUrl
  const [noteList, setNoteList] = useState([])
  const [elementList, setElementList] = useState([])
  useEffect(()=>{
    // Query for all the notes
    let apiString = `http://16.162.28.154:5000/api/note/queryAll?userEmail=${userEmail}`
    let tmpList = []
    // console.log("ep id is", episodeID)
    axios.get(apiString).then((res)=>{
      // console.log(res.data.Note)
      
      let len = res.data.Note.length
      console.log(len)
      for (let i = 0; i < len; i++) {
        if (res.data.Note[i].episodeID === episodeID) {
          tmpList.push(res.data.Note[i])
        }
      }
      // console.log(tmpList)
      setNoteList(tmpList)
    })
  }, [])

  useEffect(()=>{
    renderNoteList()
  }, [noteList])

  useEffect(()=>{
  },[elementList])




  const downloadFileHelper = (fileName, content) => {
    const aTag = document.createElement('a');
    const blob = new Blob([content]);
  
    aTag.download = fileName;
    aTag.style = "display: none";
    aTag.href = URL.createObjectURL(blob);
    document.body.appendChild(aTag);
    aTag.click();
  
    setTimeout(function () {
      document.body.removeChild(aTag);
      window.URL.revokeObjectURL(blob);
    }, 100);
  }

  const audioDownloadFileHelper = (fileName, userEmail) => {
    const aTag = document.createElement('a');
    const link = `http://16.162.28.154:5000/${userEmail}.mp3`
    aTag.href = link
    aTag.download = fileName
    aTag.style = "display: none"
    aTag.target = "_blank"
    document.body.appendChild(aTag)
    aTag.click()
  
    setTimeout(function () {
      document.body.removeChild(aTag)
    }, 100)
  }

  const downloadNotes = (timeStamp, noteString,filename) =>{
    let query = `http://16.162.28.154:5000/api/download?link=${audioUrl}&userEmail=${userEmail}&timeStamp=${timeStamp}`
    axios.get(query).then((res)=>{
      console.log(res.data)
      if (res.data === 'success') {
        audioDownloadFileHelper('audio.mp3', userEmail)
        downloadFileHelper(`${filename}.txt`, noteString)
      }
    })

  }


  const deleteNotes = (ts) => {
    console.log("Delete notes")
    let query = `http://16.162.28.154:5000/api/note/delts?userEmail=${userEmail}&podcastID=${podcastID}&episodeID=${episodeID}&timestamp=${ts}`
    axios.get(query).then(()=>{
      let apiString = `http://16.162.28.154:5000/api/note/queryAll?userEmail=${userEmail}`
      let tmpList = []
      axios.get(apiString).then((res)=>{
        let len = res.data.Note.length
        console.log(len)
        for (let i = 0; i < len; i++) {
          if (res.data.Note[i].episodeID === episodeID) {
            tmpList.push(res.data.Note[i])
          }
        }
        setNoteList(tmpList)
      }) 
    })
  }

  const noteBar = (noteString, timeStamp) => {
    let oriString = noteString.substr(0, 10)
    let string = oriString + '...'
    return (
      <div className="notebar">
        <div className="note_string_sub">
          {string}      
        </div>

        <div className='time_stamp'>
          {timeStamp}
        </div>
        <button onClick={()=>{
          downloadNotes(timeStamp, noteString, oriString)
        }}>Download</button>

        <button onClick={() => {
          deleteNotes(timeStamp)
        }}>Trash</button>

      </div>
    )
  }


  const renderNoteList = () => {
    let list = []
    for (let i = 0; i < noteList.length; i++) {
      let bar = noteBar(noteList[i].noteString, noteList[i].timestamp)
      list.push(bar)
    }
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