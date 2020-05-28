//bring in the express module and initialize it
const express = require('express');
const app = express();

//bring in the http module and set it up with express
const http = require('http').Server(app);

//bring in socket.io and set it up to use the http module
const io = require("socket.io")(http);

//bring in middleware to help express work with JSON
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); //only allow strings and arrays
//serve a static file from the directory. __dirname is from Node
app.use(express.static(__dirname + "/public")); 

const db = require("./dbConnection");
var MessageModel = db.MessageModel;


/*
//listen for 'chat message' events
socket.on("chat message", function(msg) {
    //log them in the console
    console.log("message: "  +  msg);
    //broadcast message to everyone listening to port 500
    socket.broadcast.emit("received", { message: msg });
});

//listen to 'connection' events
socket.on("connection", (socket) => {
    console.log("user connected");

    //Someone is typing
    socket.on("typing", (data) => {
        socket.broadcast.emit("notifyTyping", {
            user: data.user,
            message: data.message,
        });
    });

    //when soemone stops typing
    socket.on("stopTyping", () => {
        socket.broadcast.emit("notifyStopTyping");
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

*/

io.on("connection", (socket) => {
    console.log("User connected");

    //Once the user clicks Send, save the message in the DB, and emit a "MessageSaved" event
    socket.on('MessageSent', (msg) => {
        let messageToSave = new MessageModel({message: msg});
        MessageModel.create(messageToSave, (error, document) => {
            if(error){
                console.error("couldn't save message: " + document)
            } else {
                console.log("saved document: " + document);
                socket.emit("MessageSaved", document);
            }
            
            return db.connection.close();
        });
      });
});

const port = 500;
http.listen(port, () => {
    console.log("connected to port: " + port);
});