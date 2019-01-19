var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.get('/', function(req,res){
    res.sendFile(__dirname + '/app/index.html')
})
const users = {}
let index = 0
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
        socket.username = obj.username
        index++
        users[socket.username] = 1
        sendOnlineUsersList(socket)

        socket.broadcast.emit('newUser', {
            username: socket.username
        })
    })
    socket.on('isTyping', obj=>{
        socket.broadcast.emit('isTyping', {username: socket.username})
    })
})

function sendOnlineUsersList(socket){
    socket.broadcast.emit('onlineUsersList', users)
}


http.listen(3000, function(){
    console.log('listening on post 3000')
})