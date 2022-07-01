import * as type from "../constants/auth";


//set auth action
export const setAuth = (data) => {
    return {
      type: type.SET_AUTH,
      payload:data
    }
  }

//login action

export const loginRequest =()=>{
    return{
        type:type.LOGIN_REQUEST,
    } 
}
export const loginSuccess =(data)=>{
    return{
        type:type.LOGIN_SUCCESS,
        payload:data
    } 
}

export const loginFail =err=>{
    return{
        type:type.LOGIN_FAIL,
        payload:err
    } 
}
export const registerRequest =()=>{
    return{
        type:type.REGISTER_REQUEST,

    } 
}
export const registerSuccess =(data)=>{
    return{
        type:type.REGISTER_SUCCESS,
        payload:data
    } 
}
export const registerFail =(err)=>{
    return{
        type:type.REGISTER_FAIL,
        payload:err
    } 
}


export const follow =(data)=>{
    return{
        type:type.FOLLOW,
        payload:data
    } 
}

export const setNotifyMess =(data)=>{
    return{
        type:type.SET_COUNT_NOTIFICATION,
        payload:data
    } 
}