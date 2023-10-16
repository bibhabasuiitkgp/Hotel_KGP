const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    aadharNumber: {
        type: String,
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    roomClass: {
        type: String,
        required: true
    },
});

const BookingCollection = mongoose.model('BookingCollection', bookingSchema);

module.exports = BookingCollection;