/**
 * Created by shalin on 11/3/2016.
 */
var advertisements = require('../models/advertisements');
exports.postAdvertisement_request = function(msg, callback) {

    var res={};
    console.log("post ad queue request");
    var advertisement = new advertisements();
    advertisement.p_name = msg.p_name;
    advertisement.p_desc = msg.p_desc;
    advertisement.price = msg.price;
    advertisement.quantity = msg.quantity;
    advertisement.source = msg.source;
    advertisement.ausel = msg.ausel;
    advertisement.isCreated = msg.isCreated;
    advertisement.isComplete = msg.isComplete;
    advertisement.isEnd = msg.isEnd;
    advertisement.u_id = msg.u_id;
    advertisement.save(function (err) {
        if(err){
            callback(err,res);
        }else{
            console.log("post ad queue");
            res.code = 200;
            callback(null,res);
        }
    });
};