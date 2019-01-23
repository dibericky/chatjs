const isTypingMap = {}
$(function(){
    var socket = io()

    $("#formName").submit(e =>{
        e.preventDefault()
        const name = $("#name").val()
        socket.name = name
        socket.emit('newUser', {username:name})
    })
    

    $('#formChat').submit(function(e){
        e.preventDefault()
        socket.emit('chat message', $('#msgInput').val())
        addNewMessage(socket.name, $('#msgInput').val(), true)
        $('#msgInput').val('')
        return false
    })
    socket.on('checkName', obj =>{
        if(obj.exists){
            $("#name").focus()
            $("#warning").text('Nome utente già in uso')
        }else{
            $("#nameDiv").fadeOut()
            $("#chatDiv").fadeIn()
        }
    })
    socket.on('chat message', msgObj =>{
        console.log(msgObj)
        addNewMessage(msgObj.username, msgObj.msg)
    })
    socket.on('newUser', obj=>{
        newUserConnected(obj.username)
    })
    socket.on('isTyping', obj=>{
        isTyping(obj.username)
    })
    socket.on('onlineUsersList', usersList => {
        console.log(usersList)
        $("#onlineUsers").html('')
        Object.keys(usersList).forEach(user => {
            $("#onlineUsers").append($(`<li>`).text(`${user}`))
        })
    })
    $('#msgInput').keypress(()=>{
        socket.emit('isTyping')
    })
})

function addNewMessage(username, msg, isMe){
    let isMeClass = ''
    if(isMe) isMeClass = "class='isMe'"
    $('#messages').append($(`<li ${isMeClass}>`).text(`${username}: ${msg}`))
    setEndTyping(username)
}
function newUserConnected(username){
    $('#messages').append($('<li>').text(`${username} connected`))
}
function isTyping(username){
    isTypingMap[username] = Date.now()
    $("#isTyping").text(`${username} is typing...`)
    setTimeout(()=>{
        const timePassed = Date.now() - isTypingMap[username]
        if(timePassed > 2000){
            setEndTyping(username)
        }
    }, 3000)
}
function setEndTyping(username){
    $("#isTyping").text('')
    delete isTypingMap[username] 
}