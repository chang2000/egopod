import './PlayingPanel.css'
import React, { useState, useEffect} from 'react'
import axios from 'axios'
import 'react-h5-audio-player/lib/styles.css'
import {Editor, EditorState, convertToRaw} from 'draft-js';
import "draft-js/dist/Draft.css";
import store from '../store'

const PlayingPanel = () =>{


  const title = store.getState().coreStore[0]
  const audioUrl = store.getState().coreStore[1]
  const podID = store.getState().coreStore[2]

  const [coverUrl, setCoverUrl] = useState('')
  const [artist, setArtisit] = useState('')
  const [podName, setPodName] = useState('')
  const [desc, setDesc] = useState('')
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
  }



  useEffect(()=>{
    // Try to fetch the information of this specific episode
    let queryUrl = `https://itunes.apple.com/lookup?id=${podID}&media=podcast&entity=podcastEpisode`
    axios.get(queryUrl).then((res)=>{
      let length = res.data.resultCount
      setCoverUrl(res.data.results[0].artworkUrl600)
      setPodName(res.data.results[0].collectionName)
      setArtisit(res.data.results[0].artistName)
      // Find the desc
      for (let i = 1; i < length; i++) {
        if (res.data.results[i].episodeUrl === audioUrl) {
          console.log(res.data.results[i].description)
          setDesc(res.data.results[i].description)
        }
      }
    })
  }, [])

  return (
    <div className='core-playing-panel'>
      <div className='playing-panel-left-info'> 
      <img className='pp-left-img' 
        src={coverUrl} />

      <div className='pp-left-title'>{title}</div>
      <div className='pp-left-podname'>{podName}</div>
      <div className='pp-left-artist'>{artist}</div>
      <div className='pp-left-bookmark-btn'>
        <button>Bookmark this episode</button>
      </div>

      </div>

      <div className='pp-middle-desc'>
        {desc}
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
        
      <div className='pp-right-btn'>
        <button onClick={saveText}>Save Note</button>
      </div>
      <div className='pp-right-btn'>
        <button>View Note</button>
      </div>
      </div>
    </div>
  )
}

export default PlayingPanel