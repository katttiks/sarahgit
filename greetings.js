// greetings.js
var request = require('request');
var exports = module.exports = {};
exports.callRAPI = function(query,callback){
request('https://0b9fbf6a.ngrok.io'+ query, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        callback(null,body); //print the list
    }
    else{
        callback("ERROR", null);
    }
})
};