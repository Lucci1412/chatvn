import * as type from "../constants/auth";

import { TOKEN } from "../constants/index";
const initialState = {
  user: null,
  isAuth:false,
  isLoading: false,
};
const auth = (state = initialState, action) => {
  switch (action.type) {
    case type.SET_AUTH:
      const { user,isAuth } = action.payload;
      return {
        ...state,
        isAuth:isAuth,
        user: user,
      };
    case type.LOGIN_REQUEST:
      return {
        isLoading: true,
      };
    case type.LOGIN_SUCCESS:
      
      return {
        user: action.payload,
        isLoading: false,
      };
    case type.LOGIN_FAIL:
      return {
        user: null,
        isLoading: false,
      };
    case type.REGISTER_REQUEST:
      return {
        isLoading: true,
      };
    case type.REGISTER_SUCCESS:
      localStorage.setItem(TOKEN, action.payload.token);
      return {
        user: action.payload.registerUser,
        isLoading: false,
      };
    case type.REGISTER_FAIL:
      return {
        user: null,
        isLoading: false,
      };
      case type.FOLLOW:
      return {
        ...state,
        user: action.payload,
      };
      case type.SET_COUNT_NOTIFICATION:
        return {
          ...state,
          user: action.payload,
        };
      
    default:
      return state;
  }
};
export default auth;
