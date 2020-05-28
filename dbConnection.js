const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const connectionString = 'mongodb+srv://sampleProject:summer2020@sampleproject-so3lj.mongodb.net/chatApp?retryWrites=true&w=majority';
const db = mongoose.createConnection(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
// const Schema = mongoose.Schema;
// const messageSchema = new Schema({
//     message: String,
// });
// const Message = db.model('Message', messageSchema);
// const testMessage = new Message({message: 'This is a test message'});

// Message.create(testMessage, function (error, document) {
//     console.log(document);
//     return db.close();
// });

module.exports = db;