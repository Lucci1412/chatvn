import {combineReducers} from 'redux'
import auth from './auth'
import post from './post'
import user from './user'

import socketIo from './socket'
const myReducer = combineReducers({
    auth,post,user,socketIo
    })
export default myReducer