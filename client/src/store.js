import { createStore, combineReducers } from 'redux'


const reducer = combineReducers({
  coreStore: (state = ['', '', 0, '', 0], 
  action) => {
    let newState = Object.assign([], state);
    if (action.type === 'updateName') {
      newState[0] = action.payload
    }
    if (action.type === 'updateUrl') {
      newState[1] = action.payload
    }
    if (action.type === 'updatePodcastID') {
      newState[2] = action.payload
    }
    if (action.type === 'updateUserEmail') {
      newState[3] = action.payload
    }
    if (action.type === 'updateEpisodeID') {
      newState[4] = action.payload
    }
    return newState;
  }
});


const store = createStore(reducer)
export default store