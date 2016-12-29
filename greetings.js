// greetings.js
var request = require('request');
var exports = module.exports = {};
exports.callRAPI = function(query,callback){
request('http://ibm476-pc073gqf:8080'+ query, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        callback(null,body); //print the list
    }
    else{
        callback("ERROR", null);
    }
})
};