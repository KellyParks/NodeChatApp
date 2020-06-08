//grab the message model
const Message = require("./Models/Message");

//use to create a random username
const fantasyNameGenerator = require("fantasy-name-generator");

//keep track of the number of open connections
let numberOfConnections = 0

var ioInit = function(app){

    //bring in the http module and set it up with express
    const server = require('http').Server(app);

    //bring in socket.io and set it up to use the server
    const io = require("socket.io")(server);

    io.on("connection", (socket) => {

        numberOfConnections++;
    
        /* Set a random username for each user/connection. I like dwarf names, but to create
        one from the fantasy-name-generator, a gender is required. This randomly chooses a 
        gender, and obtains a dwarf name based on that random gender. */
        const genders = ["female", "male"];
        const randomGender = genders[Math.floor(Math.random() * genders.length)];
        socket.username = fantasyNameGenerator.nameByRace("dwarf", { gender: randomGender });
        console.log("User connected: " + socket.username);
        socket.emit("UserNameSet", socket.username);
    
        /* Once the user clicks Send, and the 'MessageSent' event is received,
        save the message in the DB, and emit a 'MessageSaved' event to signal 
        that the UI should be updated with the recently-saved message. */
        socket.on("MessageSent", (msg) => {
            let messageToSave = new Message({
                user: socket.username,
                message: msg
            });
            Message.create(messageToSave, (error, document) => {
                if(error){
                    /* Log the failure, and let only the sender know that
                    the message failed. */
                    console.error("failed to save message: " + document);
                    socket.emit("MessageSaveFailed", document);
                } else {
                    /* Log that the message was saved successfully, then let all
                    the other listeners know. */
                    console.log("saved document: " + document);
                    io.emit("MessageSaved", document);
                }
            });
          });
    
          /* On disconnect, update the number of active connections. Once the
          number of connections reaches 0, delete all the saved messages. Please
          be aware refreshing the browser removes a connection and adds a new one. */
          socket.on("disconnect", () => {
            numberOfConnections--;
            console.log("User disconnected. Total connections: " + numberOfConnections);
            if(numberOfConnections === 0){
                Message.deleteMany({}, () => {
                    console.log("No more active connections. Deleted all documents.");
                });
            }
        });
    
        /* Notify all other users that someone is typing/has stopped typing */
        socket.on("isTyping", (typingUser) => {
            socket.broadcast.emit("notifyTyping", typingUser);
        });
    
        socket.on("stoppedTyping", (notTypingUser) => {
            socket.broadcast.emit("notifyStoppedTyping", notTypingUser);
        });
    });

    return server;

}

module.exports = ioInit;