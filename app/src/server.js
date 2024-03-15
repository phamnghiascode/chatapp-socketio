const express = require("express")
const path = require("path")
const http = require('http')
const socketio = require("socket.io")
const publicPathDirectory = path.join(__dirname, "../public")
const { FilterMessage } = require("./utils/FilterMessage")
const { getUserList, getListUsersByRoomId, addUser, removeUser, findUserById } = require("./utils/users")
const app = express()
app.use(express.static(publicPathDirectory))
const server = http.createServer(app)
const io = socketio(server)



io.on('connection', (socket) => {

    //join room chat
    socket.on("client join room", ({ room, userName }) => {
        socket.join(room)

        // message for new user
        socket.emit("server send message to client", FilterMessage(`Welcome to room ${room}`, "Bot"))

        // message for other users
        socket.broadcast.to(room).emit("server send message to client", FilterMessage(`${userName} has joined room ${room}`, "Bot"))

        //receive message
        socket.on("send message from client to server", (messageText) => {
            io.to(room).emit("server send message to client", FilterMessage(messageText, userName))
        })

        // add user
        const newUser = {
            id: socket.id,
            userName,
            room
        }
        addUser(newUser)
        // users List 
        io.to(room).emit("send user list to client", getListUsersByRoomId(room))

        //remove user
        socket.on("disconnect", () => {
            removeUser(socket.id)
            io.to(room).emit("send user list to client", getListUsersByRoomId(room))
            console.log("Someone left room")
        })
        //get location from client
        socket.on("share location from client to server", ({ latitude, longitude }) => {
            const locationURL = `https://www.google.com/maps/@${latitude},${longitude}`
            //send location to other client
            io.to(room).emit("share location to other client", FilterMessage(locationURL, userName))
        })

    })
});
const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`app is running on http://localhost:${port}`)
})