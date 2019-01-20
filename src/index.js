var app = require('express')()
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
        socket.username = obj.username
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


app.get('/', function(req,res){
    res.sendFile(__dirname + '/app/index.html')
})
http.listen(PORT, function(){
    console.log('listening on post '+PORT)
})