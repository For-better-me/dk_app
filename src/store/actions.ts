  import { ORDERNUM, CARCOUNT ,TAB,CAR_LEN,GOODS_BUYING_LIST,ADDR_ID,DELIVERY_TYPE} from './constants'

  export const SetOrderNum = (orderNum) => {
    return {
      type: ORDERNUM,
      orderNum
    }
  }
  export const SetCountCar = (countCar) => {
    return {
      type: CARCOUNT,
      countCar
    }
  }
  export const SetTab = (tab) => {
    return {
      type: TAB,
      tab
    }
  }
  export const SetCarLen = (len) => {
    return {
      type: CAR_LEN,
      len
    }
  }
  export const SetGoodsBuying = (list) => {
    return {
      type: GOODS_BUYING_LIST,
      list
    }
  }
  export const SetAddrId = (id) => {
    return {
      type: ADDR_ID,
      id
    }
  }
  export const SetDeliveryType = (val) => {
    return {
      type: DELIVERY_TYPE,
      val
    }
  }
  
 
  