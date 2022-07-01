import * as type from "../constants/index";

const initialState = {
  socket: null,
  listOnline: [],
};
const socketIo = (state = initialState, action) => {
  switch (action.type) {
    case type.SOCKET:
      const data=action.payload.onlineUsers.map(user=>user.userId)
      return {
        ...state,
        socket: action.payload.socket,
        listOnline: data,
      };
    default:
      return state;
  }
};
export default socketIo;
