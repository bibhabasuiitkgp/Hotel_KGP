const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://bibhabasucvsc:18022004Basu*@cluster0.vgbwup5.mongodb.net/Guests?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connection successful"))
    .catch((err) => console.log("connection not successful"));


const logInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

const LogInCollection = new mongoose.model('LogInCollection', logInSchema)

module.exports = LogInCollection





