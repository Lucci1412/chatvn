import * as type from "../constants/post";

const initialState = {
  posts: [],
  isLoading: false,
  isModal: false,
};
const post = (state = initialState, action) => {
  switch (action.type) {
    case type.GET_POSTS:
      return {
        ...state,
        posts: action.payload,
      };
    case type.CREATE_POST_REQUEST:
      return {
        ...state,
        isLoading: true,
        isModal: true,
      };
    case type.CREATE_POST_SUCCESS:

      return {
        ...state,
        posts:[action.payload,...state.posts],
        isLoading: false,
        isModal: false,
      };
    case type.CREATE_POST_FAIL:
      return {
        ...state,
        isLoading: false,
        isModal: false,
      };
      case type.UPDATE_POST_SUCCESS:
      return {
        ...state,
        posts:[action.payload,...state.posts.filter(post=>post._id!==action.payload._id)],
      };
    case type.UPDATE_POST_FAIL:
      return {
        ...state,
      };
   
      case type.DELETE_POST_REQUEST:
        return {
          ...state,
          isModal: true,
        };
      case type.DELETE_POST_SUCCESS:  
        return {
          ...state,
          posts:[...state.posts.filter(post=>post._id!==action.payload.id)],
          isModal: false,
        };
      case type.DELETE_POST_FAIL:
        return {
          ...state,
          isModal: false,
        };
    default:
      return state;
  }
};
export default post;
