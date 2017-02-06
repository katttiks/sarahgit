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
    relevant = relevant.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    console.log(relevant);
    greetings.callRAPI("/index?doc=" + relevant, function(err,data){
    //console.log(s);   
    //console.log(data[7])
    if (err) console.log(err);
    else 
    {
        var obj1 = JSON.parse(data);
        session.send("These are the top few documents as per your query, they are:  ")
        var msg
        k = 1
        for(i=0;i<6;i++){                  
        //session.send("%s", obj1[i]['url']) 
          doc_name = (i+1) + ". " + obj1[i]['url'].substring(obj1[i]['url'].lastIndexOf('/') + 1, obj1[i]['url'].length)
          linked_doc = doc_name.link(obj1[i]['url'])
          console.log(i) 
          msg = new builder.Message(session)
          .attachments([
              new builder.HeroCard(session)
             // new builder.ThumbnailCard(session)              
              .title(doc_name)
              .subtitle(obj1[i]['url'])
              .tap(
              builder.CardAction.openUrl(session, obj1[i]['url']))                                    
        ]);
           //keep ranking
        
          session.send(doc_name + "-\n" + obj1[i]['url'])   
        }
        //session.endDialog(msg)
        //session.send("Thank you! Do you have any other query, say hi to me.")        //console.log(data);
       
    }
    //session.send('Docs: ' + data)//console.log(data);    
});
    
    }
]);
// Setup Restify Serverblahbahblah
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
 // adding changes yo
