let messages = document.getElementById("sentMessages");
const form = document.getElementById("form");

let socket = io();

socket.on("UserNameSet", (username) => {
    let currentUser = document.getElementById("currentUser");
    currentUser.prepend(username + "*: ");
});

(function(){
    form.addEventListener('submit', (event) => {
        //prevent the page from reloading
        event.preventDefault();
        const messageToSave = document.getElementById('messageInput').value;

        //send the message to the server
        socket.emit("MessageSent", messageToSave);

        // reset the message to blank
        document.getElementById('messageInput').value = "";
        return false;
    });
})();

socket.on("MessageSaved", (messageObject) => {
    console.log("Adding recently saved message to chat window: " + messageObject);
    
    let span = document.createElement("span");
    span.textContent = messageObject.user + ': ';

    let li = document.createElement("li");
    li.appendChild(span);
    messages.appendChild(li).append(messageObject.message);
});
