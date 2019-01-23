var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

const PORT = process.env.PORT || 3000
const users = {}

io.on('connection', function(socket){
    
    socket.on('chat message', (msg)=>{
        socket.broadcast.emit('chat message', {
            username: socket.username,
            msg
        })
    })
    socket.on('disconnect', function(){
        delete users[socket.username]
        sendOnlineUsersList(socket)
    })
    socket.on('newUser', (obj)=>{
        const exists = alreadyExists(obj.username)
        if(!exists){
            socket.username = obj.username
            users[socket.username] = 1
            sendOnlineUsersList(socket)
    
            socket.broadcast.emit('newUser', {
                username: socket.username
            })
        }
        socket.emit('checkName', {exists: exists})
    })

    socket.on('checkName', (obj) => {
        socket.emit('checkName', {exists: alreadyExists(obj.username)})
    })

    socket.on('isTyping', obj=>{
        socket.broadcast.emit('isTyping', {username: socket.username})
    })
})

function alreadyExists(username){
    return Object.keys(users).includes(username)
}

function sendOnlineUsersList(socket){ //BUG
    socket.emit('onlineUsersList', users)
    socket.broadcast.emit('onlineUsersList', users)
}

app.use('/', express.static(__dirname + '/app'))

http.listen(PORT, function(){
    console.log('listening on post '+PORT)
})