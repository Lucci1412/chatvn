const express = require('express');
const app = express();
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const multer = require('multer')
const authRoute = require('./Routes/auth.js')
const userRoute = require('./Routes/user')
const postRoute = require('./Routes/post')
const boxMessengerRoute = require('./Routes/boxMessenger')
const messageRoute = require('./Routes/messenger')
const commentRoute = require('./Routes/comment')
const notificationRoute = require('./Routes/notification.js')
const reportRoute = require('./Routes/report.js')
const emailRoute = require('./Routes/email.js')
const path = require("path");
const socket = require("socket.io");
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT
app.use("/img", express.static(path.join(__dirname, "public/img")));
app.use("/upload", express.static(path.join(__dirname, "public/upload")));
//middleware
app.use(express.json());
app.use(morgan('combined'))
app.use(cors())

    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('MongoDB connected!!');
    }).catch(err => {
        console.log('Failed to connect to MongoDB', err);
    });

    app.use('/api/user',userRoute);
    app.use('/api/auth',authRoute);
    app.use('/api/post', postRoute);
    app.use('/api/messenger', messageRoute);
    app.use('/api/boxMessenger', boxMessengerRoute);
    app.use('/api/comment', commentRoute);
    app.use('/api/notification', notificationRoute);
    app.use('/api/report', reportRoute);
    app.use('/api/email', emailRoute);
    app.listen(PORT, () => {
        console.log(`Server đang chạy với port ${PORT}`)
    })

    
    //socket.io
    
const io = socket(8080, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  

let onlineUsers = [];
const addNewUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (id) => {
  return onlineUsers.find((user) => user.userId === id);
};

io.on("connection", (socket) => {
  console.log("a user connected.");
  socket.on("newUser", (userId) => {
    addNewUser(userId, socket.id);
    io.emit("getOnlineUser", onlineUsers);
  });

  socket.on("sendMessenger", ({ senderId, receiverId, text }) => {
    const receiver = getUser(receiverId)
    receiver&&io.to(receiver.socketId).emit("getMessenger", {
      senderId,
      text,
    });
  });
  

  socket.on("sendNotification", ({ senderId, receiverId, type,postId,_id}) => {
    const receiver = getUser(receiverId);
    receiver&&io.to(receiver.socketId).emit("getNotification", {
      senderId,
      type,
      postId,
      createdAt: Date.now(),
      status:true,
      _id
    });
  });

 

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getOnlineUser", onlineUsers);
  });
})


