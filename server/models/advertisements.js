/**
 * Created by shalin on 10/25/2016.
 */
var mongoose = require('mongoose');

var user_info = require('../models/user_info');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    source: {type: String},
    p_name: {type: String},
    p_desc: {type: String},
    price: {type: Number},
    quantity: {type: Number},
    ausel: {type: String},
    source: {type: String},
    isCreated: {type: Number},
    isEnd: {type: Number},
    isComplete: {type: Number},
    u_id:{
        type: Schema.Types.ObjectId,
        ref: 'user_info'
    }
});

var advertisements = mongoose.model('advertisements', productSchema);

module.exports = advertisements;