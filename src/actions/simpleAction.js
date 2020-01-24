import fetch from 'axios'
import config from '../config'
/* 
  src/actions/simpleAction.js
*/
export const simpleAction = () => async dispatch => {
  const tasks = (await fetch(`${config.apiEnpoint}/?developer=Name`)).data
  if(tasks.status === 'error')
  {
    console.error(tasks.message)
  }

  dispatch({
    type: 'TASKS',
    payload: tasks.message.tasks
  })
}

export const nextPage = () => async (dispatch, getState) => {
  const state = getState().simpleReducer
  const { column, mode } = state
  const url = `${config.apiEnpoint}/?developer=Name&page=${+state.pageNum + 1}&sort_field=${column}&sort_direction=${mode}`
  const tasks = (await fetch(url)).data
  if(tasks.status === 'error')
  {
    console.error(tasks.message)
  }

  dispatch({
    type: 'NEXT',
    payload: tasks.message.tasks
  })
}

export const prevPage = () => async (dispatch, getState) => {
  const state = getState().simpleReducer
  const { column, mode } = state
  const url = `${config.apiEnpoint}/?developer=Name&page=${+state.pageNum - 1}&sort_field=${column}&sort_direction=${mode}`
  const tasks = (await fetch(url)).data
  if(tasks.status === 'error')
  {
    console.error(tasks.message)
  }

  dispatch({
    type: 'PREV',
    payload: tasks.message.tasks
  })
}


export const sortBy = (column, mode) => async (dispatch, getState) => {
  const state = getState().simpleReducer
  const url = `${config.apiEnpoint}/?developer=Name&page=${1}&sort_field=${column}&sort_direction=${mode}`
  const tasks = (await fetch(url)).data
  if(tasks.status === 'error')
  {
    console.error(tasks.message)
  }

  dispatch({
    type: 'SORT',
    payload: { column, mode, tasks: tasks.message.tasks }
  })
}

export const singin = (payload) => async (dispatch, getState) => {
  const state = getState().simpleReducer
  const url = `${config.apiEnpoint}/login/?developer=Name`
  const data = new FormData()
  Object.keys(payload).forEach(key => data.append(key, payload[key]))
  
  const token = (await fetch.post(url, data, {
    mode: 'cors',
    headers: {
      'Accept': 'application/json', 
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'multipart/form-data'
    }  })).data
  
  sessionStorage.setItem('token', token)
  if(token.status === 'error')
  {
    console.error(token.message)
    const first = Object.keys(token.message)[0]
    dispatch({
      type: 'SHOW_TOAST',
      payload: `${first}: ${token.message[first]}`
    })
  }

  dispatch({
    type: 'AUTH',
    payload: { token: token.message.token }
  })
}

export const postNew = (payload) => async (dispatch, getState) => {
  const state = getState().simpleReducer
  const url = `${config.apiEnpoint}/create/?developer=Name`
  const fdata = new FormData()
  Object.keys(payload).forEach(key => fdata.append(key, payload[key]))
  const task = (await fetch.post(url, fdata )).data
  if(task.status === 'error')
  {
    console.error(task.message)
    const first = Object.keys(task.message)[0]
    dispatch({
      type: 'SHOW_TOAST',
      payload: `${first}: ${task.message[first]}`
    })
  }

  dispatch({
    type: 'POSTED',
    payload: { post: task.message }
  })
  dispatch({
    type: 'SHOW_TOAST',
    payload: task.message.text
  })
}


export const editPost = (payload) => async (dispatch, getState) => {
  const state = getState().simpleReducer
  const token = sessionStorage.getItem('token')
  const url = `${config.apiEnpoint}/edit/${payload.id}?developer=Name`
  const fdata = new FormData()
  Object.keys(payload).forEach(key => fdata.append(key, payload[key]))
  const task = (await fetch.post(url, fdata )).data
  if(task.status === 'error')
  {
    console.error(task.message)
    const first = Object.keys(task.message)[0]
    dispatch({
      type: 'SHOW_TOAST',
      payload: `${first}: ${task.message[first]}`
    })
  }

  dispatch({
    type: 'POSTED',
    payload: { post: task.message }
  })
  dispatch({
    type: 'SHOW_TOAST',
    payload: task.message.text
  })
}

export const hideToast = () => dispatch => {
  dispatch({
    type: 'HIDE_TOAST'
  })
}

export const showToast = (message) => dispatch => {
  dispatch({
    type: 'SHOW_TOAST',
    payload: message
  })
}