import * as type from "../constants/post";
export const getPosts = (data) => {
  return {
    type: type.GET_POSTS,
    payload: data,
  };
};

export const createPostRequest = () => {
  return {
    type: type.CREATE_POST_REQUEST,
  };
};
export const createPostSuccess = (data) => {
  return {
    type: type.CREATE_POST_SUCCESS,
    payload: data,
  };
};

export const createPostFail = (err) => {
  return {
    type: type.DELETE_POST_FAIL,
    payload: err,
  };
};



export const deletePostRequest = () => {
  return {
    type: type.DELETE_POST_REQUEST,
  };
};
export const deletePostSuccess = (id) => {
  return {
    type: type.DELETE_POST_SUCCESS,
    payload: id,
  };
};

export const deletePostFail = (err) => {
  return {
    type: type.DELETE_POST_FAIL,
    payload: err,
  };
};



export const updatePostRequest = () => {
  return {
    type: type.UPDATE_POST_REQUEST,
  };
};
export const updatePostSuccess = (data) => {
  return {
    type: type.UPDATE_POST_SUCCESS,
    payload: data,
  };
};

export const updatePostFail = (err) => {
  return {
    type: type.UPDATE_POST_FAIL,
    payload: err,
  };
};