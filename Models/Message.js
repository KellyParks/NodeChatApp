const mongoose = require("mongoose");
const connection = require("../dbConnection");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    user: String,
    message: String,
});

/* mongoose.model() will use the default mongoose connection, 
so we need to bring in the custom connection and set the model 
on it to apply the schema. */
const Message = connection.model('Message', messageSchema);

module.exports = Message;