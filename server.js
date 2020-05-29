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
app.use(express.static(__dirname + "/public/")); 

//grab the connection and model info
const db = require("./dbConnection");
var MessageModel = db.MessageModel;

//using to create a random username
const fantasyNameGenerator = require("fantasy-name-generator");

//keep track of the number of open connections
let numberOfConnections = 0

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
        let messageToSave = new MessageModel({
            user: socket.username,
            message: msg
        });
        MessageModel.create(messageToSave, (error, document) => {
            console.log('create called');
            if(error){
                console.error("couldn't save message: " + document)
            } else {
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
            MessageModel.deleteMany({}, () => {
                console.log("No more active connections. Deleted all documents.");
            });
        }
    });
});

const port = 500;
http.listen(port, () => {
    console.log("connected to port: " + port);
});