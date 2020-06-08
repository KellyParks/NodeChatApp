//bring in the express module and initialize it
const express = require('express');
const app = express();

//initialize socket.io with express
const ioServer = require('./ioServer')(app);

//serve a static file from the directory. __dirname is from Node
app.use(express.static(__dirname + "/public/"));

const port = 500;
ioServer.listen(port, () => {
    console.log("connected to port: " + port);
});