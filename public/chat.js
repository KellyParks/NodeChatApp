var messages = document.getElementById("messages");
const form = document.getElementById("form");

(function(){
    var socket = io();
    form.addEventListener('submit', (event) => {
        //prevent the page from reloading
        event.preventDefault();
        const messageToSaveAndDisplay = document.getElementById('messageInput').value;

        //send the message to the server
        socket.emit("MessageSent", messageToSaveAndDisplay);

        // let li = document.createElement("li");
        // messages.appendChild(li).append(messageToSaveAndDisplay);
        // let span = document.createElement("span");
        // messages.appendChild(span).append("By Anonymous: ");

        // //reset the message to blank
        //document.getElementById('messageInput').value = "";
        return false;
    });
})();

/*
 --- Typing Indicator Section --- 
let typing = document.getElementById("typing");

//isTyping event
let messageInput = document.getElementById("messageInput");
messageInput.addEventListener("keypress", () => {
    socket.emit("isTyping", { user: "Someone", message: "is typing..." });
});

//stopTyping event
messageInput.addEventListener("keyup", () => {
    socket.emit("stopTyping", "");
});

//listen for the notifyTyping event from server.js and update the view to let the other user know what someone is typing
socket.on("notifyTyping", (data) => {
    typing.innerText = data.user + " " + data.message;
    console.log("notifying user that other person is typing: " + data.user + data.message);
});

socket.on("stopTyping", () => {
    socket.broadcast.emit("notifyStopTyping");
});
*/