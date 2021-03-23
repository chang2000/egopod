import { createStore, combineReducers } from 'redux'


const reducer = combineReducers({
  coreStore: (state = ['oName','oUrl'], action) => {
    let newState = Object.assign([], state);
    if (action.type === 'updateUrl') {
      newState[1] = action.payload
    }
    if (action.type === 'updateName') {
      newState[0] = action.payload
    }
    return newState;
  }
});


const store = createStore(reducer)
export default store