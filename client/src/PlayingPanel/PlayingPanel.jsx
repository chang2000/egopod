import './PlayingPanel.css'
import React, { useState, useEffect} from 'react'
import axios from 'axios'
import 'react-h5-audio-player/lib/styles.css'
import {Editor, EditorState, convertToRaw, ContentState} from 'draft-js';
import "draft-js/dist/Draft.css";
import store from '../store'

const PlayingPanel = () =>{


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
    const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
    console.log(value)
    let timeStamp = document.getElementById('rhap_current-time').innerHTML
    console.log(timeStamp)
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
    let bmQuery = `http://localhost:5000/api/bm/queryAll?userEmail=${userEmail}`
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

  const bmEpisode = () => {
    let query = `http://localhost:5000/api/bm/addbm?podcastID=${podID}&episodeID=${epID}&userEmail=${userEmail}`
    axios.get(query).then(res=>{
      setBookmarked(true)
    })
  }

  const unBmEpisode = () => { 
    let query = `http://localhost:5000/api/bm/unbm?podcastID=${podID}&episodeID=${epID}&userEmail=${userEmail}`
    axios.get(query).then(res=>{
      setBookmarked(false)
    })
  }

  return (
    <div className='core-playing-panel'>
      <div className='pp-left'> 
        <img className='pp-left-img' 
          alt=""
          src={coverUrl} />

        <div className='pp-left-title'>{title}</div>
        <div className='pp-left-podname'>{podName}</div>
        <div className='pp-left-artist'>{artist}</div>

        {
          bookmarked?
          <div className='pp-left-bookmark-btn' onClick={unBmEpisode}>
            UnBookmark this Episode
          </div>
          :
          <div className='pp-left-bookmark-btn' onClick={bmEpisode}>
            Bookmark this Episode
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

      <div className='pp-right-btn view'>
        View Note 
      </div>
      </div>
    </div>
  )
}

export default PlayingPanel