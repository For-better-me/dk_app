  import { ORDERNUM, CARCOUNT ,TAB,CAR_LEN} from './constants'

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
  
 
  