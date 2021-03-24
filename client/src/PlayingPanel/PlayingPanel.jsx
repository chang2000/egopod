import './PlayingPanel.css'
import React, { useState, useEffect} from 'react'
import axios from 'axios'
import 'react-h5-audio-player/lib/styles.css'
import {useDispatch} from 'react-redux'
import store from '../store'

const PlayingPanel = () =>{



  useEffect(()=>{

  })
  return (
    <div className='core-playing-panel'>
      <div className='playing-panel-left-info'> 
      Left info
      </div>

      <div className='playing-panel-middle-desc'>
        This is the middle desc
      </div>

      <div className='playing-panel-right-note'>
        The note taking area
      <textarea></textarea>
      </div>
    </div>
  )
}

export default PlayingPanel