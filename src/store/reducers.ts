import { combineReducers } from 'redux'
import { ORDERNUM, CARCOUNT,TAB,CAR_LEN } from './constants'

const INITIAL_STATE = {
  orderNum: '123456',
  countCar: 0,
  tab:0,
  len:0
}

let reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ORDERNUM:
      return {
        ...state,
        orderNum: action.orderNum
      }
    case CARCOUNT:
      return {
        ...state,
        countCar: action.countCar
      }
    case TAB:
      return {
        ...state,
        tab: action.tab
      }
    case CAR_LEN:
      return {
        ...state,
        len: action.len
      }
    default:
      return state
  }
}
export default combineReducers({
  reducer
})
