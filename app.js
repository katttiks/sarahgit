// Add your requirements
var restify = require('restify'); 
var builder = require('botbuilder'); 
var dotenv = require('dotenv');
var greetings = require("./greetings.js");

// var appId = process.env.MY_APP_ID || "missing appId";
// appPassword: process.env.MY_APP_SECRET || "missing app password";  
dotenv.load()

console.log(process.env.MY_APP_ID);
// Create chat bot and add dialogs
var connector = new builder.ChatConnector({ appId:process.env.MY_APP_ID, appPassword: process.env.MY_APP_SECRET});
var bot = new builder.UniversalBot(connector);

console.log(connector);

bot.dialog('/', [
    function(session) {
        builder.Prompts.text(session, 'Enter your topic');
    },
    function(session, results) {
    s = results.response;
    
    greetings.callRAPI("/index?doc=" + results.response, function(err,data){
    //console.log(s);
    //console.log(data[7])
    
    if (err) console.log(err);
    else 
    {
        var obj1 = JSON.parse(data);
        for(i=0;i<6;i++){
        session.send("the key of awesome is me!");
        session.send("Document:%s   Score: %s", obj1[i]['id'], obj1[i]['scores'])
        }
        //console.log(data);
    }
    //session.send('Docs: ' + data)//console.log(data);
    
});
    }
]);
// Setup Restify Server
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || 3000, function() 
{
   console.log('%s listening to %s', server.name, server.url); 
});

server.post('/api/messages', connector.listen());

// server.get('/', restify.serveStatic({
//  directory: __dirname,
//  default: '/index.html'
// }));