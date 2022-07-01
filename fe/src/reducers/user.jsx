import * as type from "../constants/user";

const initialState = {
  isLoading: false,
};
const user = (state = initialState, action) => {
  switch (action.type) {
    case type.UPDATE_AVATAR_REQUEST:
      return {
        isLoading: true,
      };
    case type.UPDATE_AVATAR_SUCCESS:
      return {
        isLoading: false,
      };
    case type.UPDATE_AVATAR_FAIL:
      return {
        isLoading: false,
      };
      
    default:
      return state;
  }
};
export default user;
