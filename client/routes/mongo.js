/**
 * Created by shalin on 10/23/2016.
 */
var mongo = require('mongodb').MongoClient;
var connected = false;



exports.connect = function(url, callback) {
    mongo.connect(url, function (err, _db) {
        if (!err) {
            connected = true;
            db = _db;
            callback(err, db);
        } else {
            console.log('rrr'+err);

        }
    });
};

exports.collection = function(name, db){

    if(connected) {
        return db.collection(name);
    } else {
        console.log('not connected');
    }

};

