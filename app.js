// Add your requirements
var restify = require('restify'); 
var builder = require('botbuilder'); 
var dotenv = require('dotenv');
var greetings = require("./greetings.js");

// var appId = process.env.MY_APP_ID || "missing appId";
// appPassword: process.env.MY_APP_SECRET || "missing app password";  
dotenv.load()


// Create chat bot and add dialogs
var connector = new builder.ChatConnector({ appId:process.env.MY_APP_ID, appPassword: process.env.MY_APP_SECRET});
var bot = new builder.UniversalBot(connector);


bot.dialog('/', [
    function(session) {
        builder.Prompts.text(session, 'Enter your topic');
    },
    function(session, results) {
    var relevant = results.response;
    relevant.replace('?',"")
    relevant = relevant.replace(/ is| what|what| a | are| the| or| in| of| be| case|/gi,"")
    console.log(relevant);
    greetings.callRAPI("/index?doc=" + relevant, function(err,data){
    //console.log(s);
    //console.log(data[7])
    if (err) console.log(err);
    else 
    {
        var obj1 = JSON.parse(data);
        for(i=0;i<6;i++){  
                  
            session.send("Document:%s   Score: %s  URL: %s", obj1[i]['id'], obj1[i]['scores'], obj1[i]['url'])        
        }
        session.send("Thank you! Do you have any other query, say hi to me.")        //console.log(data);
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

server.get('/', restify.serveStatic({
 directory: __dirname,
 default: '/index.html'
}));
 // adding changes
 