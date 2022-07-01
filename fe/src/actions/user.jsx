import * as type from '../constants/user'
export const updateAvatarRequest =()=>{
    return{
        type:type.UPDATE_AVATAR_REQUEST,

    } 
}
export const updateAvatarSuccess =(data)=>{
    return{
        type:type.UPDATE_AVATAR_SUCCESS,
        payload:data
    } 
}
export const updateAvatarFail =(err)=>{
    return{
        type:type.UPDATE_AVATAR_FAIL,
        payload:err
    } 
}
