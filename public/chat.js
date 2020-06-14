let messages = document.getElementById("sentMessages");
const form = document.getElementById("form");

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

let socket = io();
let chatUsername = "";

socket.on("UserNameSet", (username) => {
    chatUsername = username;
    let currentUser = document.getElementById("currentUser");
    currentUser.prepend(username + "*: ");
});

socket.on("MessageSaveFailed", (messageObject) => {
    let span = document.createElement("span");
    span.textContent = "The following message failed to save: ";

    let li = document.createElement("li");
    li.setAttribute('class', 'bg-warning');

    li.appendChild(span);
    
    messages.appendChild(li).append(messageObject.message);
});

socket.on("MessageSaved", (messageObject) => {
    console.log("Adding recently saved message to chat window: " + messageObject);
    
    let span = document.createElement("span");
    span.textContent = messageObject.user + ': ';

    let li = document.createElement("li");
    li.appendChild(span);
    messages.appendChild(li).append(messageObject.message);
});

/* Typing Indicator Event Logic */

/* It's a bit jolting on the UI to have the list of currently typing users updated so often.
It should wait a few seconds after the keyup event before updating. Probably a good candidate for
an observable instead. */

//isTyping event
let messageInput = document.getElementById("messageInput");
messageInput.addEventListener("keypress", () => {
    socket.emit("isTyping", chatUsername);
});

//stopTyping event
messageInput.addEventListener("keyup", () => {
    socket.emit("stoppedTyping", chatUsername);
});

let usersTyping = [];

//listen for the notifyTyping event from server.js and update the view to let the other user know what someone is typing
socket.on("notifyTyping", (typingUser) => {
    if(!usersTyping.includes(typingUser)){
        usersTyping.push(typingUser);
    }
    typingIndicator = document.getElementById("otherUserTypingIndicator");
    if(usersTyping){
        let allCurrentlyTypingUsersText = usersTyping.join(", ");
        typingIndicator.innerText = allCurrentlyTypingUsersText + " is typing...";
    }
});

//listen for the notifyStoppedTyping event from server.js and update the view to remove the user from the list of users who are typing
socket.on("notifyStoppedTyping", (typingUser) => {
    let updatedTypingUsers = usersTyping.filter((user) => {
        return user !== typingUser
    });
    typingIndicator = document.getElementById("otherUserTypingIndicator");
    if(updatedTypingUsers.length > 0){
        let allCurrentlyTypingUsersText = updatedTypingUsers.join(", ");
        typingIndicator.innerText = allCurrentlyTypingUsersText + " is typing...";
    } else {
        typingIndicator.innerText = '';
    }
});
