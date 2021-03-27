const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    posts: [{type: Types.ObjectId, ref: "Post"}],
    subscribes: [{type: Types.ObjectId, ref: "Subscribe"}],
});

module.exports = model("User", schema);
