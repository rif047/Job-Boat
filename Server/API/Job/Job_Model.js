const Mongoose = require('mongoose');


let current = new Date();
let timeStamp = current.setHours(current.getHours() + 6);



const PropertySchema = Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    city: {
        type: String,
    },
    property_type: {
        type: String,
    },
    property_for: {
        type: String,
    },
    decimal: {
        type: Number
    },
    sqft: {
        type: Number
    },
    agree_price: {
        type: Number
    },
    sell_price: {
        type: Number
    },
    drive: {
        type: String
    },
    map: {
        type: String
    },
    source: {
        type: String
    },
    comments: {
        type: String
    },
    images: {
        type: [String]
    },
    owner: {
        type: Mongoose.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    employee: {
        type: Mongoose.Types.ObjectId,
        ref: 'Employee',
    },
    date: {
        type: String
    },
    status: {
        type: String
    },
    createdOn: {
        type: Date,
        default: timeStamp
    },
})

let Property = Mongoose.model('Property', PropertySchema)

module.exports = Property;