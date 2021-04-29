import './PlayingPanel.css'
import React, { useState, useEffect} from 'react'
import axios from 'axios'
import 'react-h5-audio-player/lib/styles.css'
import {Editor, EditorState, convertToRaw, ContentState} from 'draft-js';
import "draft-js/dist/Draft.css";
import store from '../store'
import {
  Link
} from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotesViewer from '../NotesViewer/NotesViewer';
import apiAddress from '../config'


const PlayingPanel = () =>{

  const [open, setOpen] = React.useState(false);
  const title = store.getState().coreStore[0]
  const audioUrl = store.getState().coreStore[1]
  const podID = store.getState().coreStore[2]
  const userEmail = store.getState().coreStore[3]
  const epID = store.getState().coreStore[4]

  const [coverUrl, setCoverUrl] = useState('')
  const [artist, setArtisit] = useState('')
  const [podName, setPodName] = useState('')
  const [desc, setDesc] = useState('')
  const [bookmarked, setBookmarked] = useState();
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const editor = React.useRef(null);
  const focusEditor = ()=> {
    editor.current.focus();
  }

  const saveText = ()=> {
    const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
    const noteString = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
    let timeStamp = document.getElementById('rhap_current-time').innerHTML
    if (timeStamp.length === 5) {
      timeStamp = '0:' + timeStamp
    }
    console.log(timeStamp)
    // console.log(noteString)
    // API Call
    let apiString = `${apiAddress}/api/note/addts?userEmail=${userEmail}&podcastID=${podID}&episodeID=${epID}&timeStamp=${timeStamp}&noteString=${noteString}`
    axios.get(apiString)
    setEditorState(()=>EditorState.createEmpty())
  }



  useEffect(()=>{
    // Try to fetch the information of this specific episode
    let queryUrl = `https://itunes.apple.com/lookup?id=${podID}&media=podcast&entity=podcastEpisode&timestamp=${new Date().getTime()}`
    axios.get(queryUrl).then((res)=>{
      let length = res.data.resultCount
      setCoverUrl(res.data.results[0].artworkUrl600)
      setPodName(res.data.results[0].collectionName)
      setArtisit(res.data.results[0].artistName)
      // Find the desc
      for (let i = 1; i < length; i++) {
        if (res.data.results[i].episodeUrl === audioUrl) {
          let d = res.data.results[i].description
          // console.log(d)
          setDesc(d)
        }
      }
    })

    // Check if the current episode is bookmarked
    let bmQuery = `${apiAddress}/api/bm/queryAll?userEmail=${userEmail}`
    // console.log("MY ID IS", epID)
    axios.get(bmQuery).then(res=>{
      let epList = res.data.subscribedIDs
      // Compare
      let found = false
      for (let i = 0; i < epList.length; i++) {
        if ((epList[i].podcastID).toString() === podID && (epList[i].episodeID).toString() == epID) {
          // console.log('yes')
          found = true
        }
      }
      if (found) {
        setBookmarked(true)
      } else {
        setBookmarked(false)
      }
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=>{

  }, [bookmarked])


  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const bmEpisode = () => {
    console.log(userEmail)
    if (userEmail === '') {
      toast("Please Signin")
    } else {
      let query = `${apiAddress}/api/bm/addbm?podcastID=${podID}&episodeID=${epID}&userEmail=${userEmail}`
      axios.get(query).then(res=>{
        setBookmarked(true)
      })
    }
  }

  const unBmEpisode = () => { 
    let query = `${apiAddress}/api/bm/unbm?podcastID=${podID}&episodeID=${epID}&userEmail=${userEmail}`
    axios.get(query).then(res=>{
      setBookmarked(false)
    })
  }

  const jumpToPodInfo = () => {
    console.log('clicked podid is', podID)
    window.localStorage.setItem("jump-from-library", "true")
    window.localStorage.setItem("podid-jump", podID);
  }


  return (
    <div className='core-playing-panel'>
      <div className='pp-left'> 
      <Link to="/explore">
        <img className='pp-left-img' 
          onClick={jumpToPodInfo}
          alt=""
          src={coverUrl} />
      </Link>

        <div className='pp-left-title'>{title}</div>
        <div className='pp-left-podname'>{podName}</div>
        <div className='pp-left-artist'>{artist}</div>

        {
          bookmarked?
          <div className='pp-left-bookmark-btn bookmarked' onClick={unBmEpisode}>
            Bookmarked
          </div>
          :
          <div className='pp-left-bookmark-btn not_bookmarked' onClick={bmEpisode}>
            Bookmark
          </div>
        }
      </div>

      <div className='pp-middle'>
        <div className='pp-middle-title'>
          Description
        </div>
        <div className='pp-middle-desc'>
          {desc}
        </div>
      </div>

      <div className='pp-right-note'>
      <div
      style={{ 
        border: "1px solid black", 
        minHeight: "18rem", 
        minWidth: "33vh",
        cursor: "text",
      }}
      onClick={focusEditor}>
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={setEditorState}
        placeholder="Write down the inspiration!"
      />
      </div>
        
      <div className='pp-right-btn save' onClick={saveText}>
        Save Note
      </div>

      <div className='pp-right-btn view' onClick={handleOpen}>
        View Note 
      </div>
      {
        open === true ? 
        <NotesViewer className='notes-viewer'
        userEmail={userEmail}
        episodeID={epID}
        podcastID={podID}
        audioUrl={audioUrl}
        /> :
        <div /> 
      }

      </div>
      <ToastContainer />
    </div>
  )
}

export default PlayingPanel