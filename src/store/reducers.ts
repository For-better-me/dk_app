import { combineReducers } from 'redux'
import { ORDERNUM, CARCOUNT, TAB, CAR_LEN, GOODS_BUYING_LIST, ADDR_ID,DELIVERY_TYPE } from './constants'

const INITIAL_STATE = {
  orderNum: '123456',
  countCar: 0,
  tab: 0,
  len: 0,
  goodsBuyingList: [],
  addrId: '',
  deliveryType:2
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
    case GOODS_BUYING_LIST:
      return {
        ...state,
        goodsBuyingList: action.list
      }
    case ADDR_ID:
      return {
        ...state,
        addrId: action.id
      }
      case DELIVERY_TYPE:
      return {
        ...state,
        deliveryType: action.val
      }
    default:
      return state
  }
}
export default combineReducers({
  reducer
})
