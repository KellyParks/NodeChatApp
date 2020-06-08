const mongoose = require("mongoose");

const connectionString = 'mongodb+srv://sampleProject:summer2020@sampleproject-so3lj.mongodb.net/chatApp?retryWrites=true&w=majority';
const connection = mongoose.createConnection(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = connection;