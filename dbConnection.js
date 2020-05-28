const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const connectionString = 'mongodb+srv://sampleProject:summer2020@sampleproject-so3lj.mongodb.net/chatApp?retryWrites=true&w=majority';
const connection = mongoose.createConnection(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;
const messageSchema = new Schema({
    message: String,
});
var MessageModel = connection.model('Message', messageSchema);

//Instead of requiring mongoose again in server.js I could just include what I need from it in the exports object here.
//not sure if this is best practice though
module.exports = {
    MessageModel: MessageModel,
    connection: connection,
};