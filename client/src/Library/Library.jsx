import "./Library.css"
import React, { useState, useEffect} from 'react'
import axios from 'axios'

const Library = () => {

  return (
    <div className='library-page'>

      <div className='lib-sub'>
        Subscribe tab
      </div>

      <div className='lib-bm'>
        Bookmark tab
      </div>

    </div>
  )
}


export default Library