const isTypingMap = {}
$(function(){
    var socket = io()
    setTimeout(()=>{
        $("#chatImg img").show()
        $("#chatImg img").css("opacity", "1")
        $("#chatImg img").addClass('slideInLeft')   
    }, 500)
    
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
            $("#chatContainer").fadeIn()
            $("footer").hide()
        }
    })
    socket.on('chat message', msgObj =>{
        console.log(msgObj)
        addNewMessage(msgObj.username, msgObj.msg)
    })
    socket.on('newUser', obj=>{
        newUserConnected(obj.username, true)
    })
    socket.on('isTyping', obj=>{
        isTyping(obj.username, true)
    })
    socket.on('onlineUsersList', usersList => {
        console.log(usersList)
        $("#onlineUsers").html('')
        usersList.forEach(user => {
            $("#onlineUsers").append($(`<li>`).text(`${user}`))
        })
    })
    socket.on('disconnect', obj => {
        newUserConnected(obj.username, false)
    })
    $('#msgInput').keypress(()=>{
        socket.emit('isTyping')
    })
    socket.on('a', obj => console.log(obj))
})

function addNewMessage(username, msg, isMe){
    let isMeClass = ''
    if(isMe) isMeClass = "class='isMe'"
    $('#messages').append($(`<li ${isMeClass}>`).text(`${username}: ${msg}`))
    setEndTyping(username)
    scrollChat()
}
function newUserConnected(username, isConnected){
    $('#messages').append($('<li>').text(`${username} ${isConnected?'connected':'disconnected'}`))
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
function scrollChat(){
    const container = $("#messages")[0]
    container.scrollTop = container.scrollHeight;
}