/* 
  src/reducers/simpleReducer.js
*/
export default (state = { pageNum: 1, column: 'id', mode: 'asc', isToastShown: true, toastText: '' }, { payload, type }) => {
  switch (type) {
    case 'TASKS':
      return {
        ...state,
        tasks: payload,
        pageNum: 1
      }
    case 'NEXT':
      return {
        ...state,
        pageNum: +state.pageNum + 1,
        tasks: payload
      }
    case 'PREV':
      return {
        ...state,
        pageNum: +state.pageNum - 1 || 1,
        tasks: payload
      }
    case 'SORT':
      return {
        ...state,
        ...payload,
        pageNum: 1
      }
    case 'AUTH':
      return {
        ...state,
        ...payload,
        loggedIn: !!payload.token
      }
    case 'SHOW_TOAST':
      return {
        ...state,
        toastText: payload,
        isToastShown: true
      }
    case 'HIDE_TOAST':
      return {
        ...state,
        isToastShown: false
      }
    case 'POSTED':
      return {
        ...state,
        tasks: [ ...state.tasks, payload.post ]
      }
    default:
      return state
  }
}
