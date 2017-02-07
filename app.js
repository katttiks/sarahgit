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

var relevant
var obj1

bot.dialog('/', [
    function(session) {
        builder.Prompts.text(session, 'Enter your topic');
    },

    function(session, results) {
    relevant = results.response;
    relevant.replace('?',"")
    relevant = relevant.replace(/ is| what|what| a | are| the| or| in| of| be| case|/gi,"")
    relevant = relevant.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    greetings.callRAPI("/index?doc=" + relevant, function(err,data){
    if (err) console.log(err);
    else 
    {
        obj1 = JSON.parse(data);
        session.send("These are the top few documents as per your query:  ")
        for(i=0;i<5;i++){                  
        //session.send("%s", obj1[i]['url']) 
          doc_name = obj1[i]['url'].substring(obj1[i]['url'].lastIndexOf('/') + 1, obj1[i]['url'].length)         
           session.send(doc_name +  "<br>" + obj1[i]['url']) 
        }
        builder.Prompts.text(session, 'Did you find what you were looking for?');        //console.log(data);       
    }
});    
    },

    function(session, results){
       answer = results.response
       if(answer.toLowerCase().indexOf('no')>-1||answer.toLowerCase().indexOf('not')>-1||answer.toLowerCase().indexOf('nope')>-1) 
        {
             session.send("All right, I'll render some more documents for you.")
             session.send("Here you go: ")
       
            for(i=5;i<9;i++){                  
            //session.send("%s", obj1[i]['url']) 
                doc_name = obj1[i]['url'].substring(obj1[i]['url'].lastIndexOf('/') + 1, obj1[i]['url'].length)           
                session.send(doc_name +  "<br>" + obj1[i]['url'])                 
            }
        builder.Prompts.text(session, 'Did you find what you were looking for this time?');        
        }
      else if(answer.toLowerCase().indexOf('yes')>-1||answer.toLowerCase().indexOf('yeah')>-1||answer.toLowerCase().indexOf('yup')>-1)  
      {
          session.send("Well, that's great! A person as awesome as me generally gets the job done.")
          session.send('Do you want to search some other topic')
      }      
    },

  function(session, results){
       answer = results.response
       if(answer.toLowerCase().indexOf('no')>-1||answer.toLowerCase().indexOf('not')>-1||answer.toLowerCase().indexOf('nope')>-1) 
        {
             session.send("All right, I'll render some more documents for you.")
             session.send("Here you go: ")
       
            for(i=0;i<3;i++){                  
            //session.send("%s", obj1[i]['url']) 
                doc_name = obj1[i]['url'].substring(obj1[i]['url'].lastIndexOf('/') + 1, obj1[i]['url'].length)           
                session.send(doc_name +  "<br>" + obj1[i]['url'])                 
            }
        builder.Prompts.text(session, 'Hope you found it this time!');       
        }
        else if(answer.toLowerCase().indexOf('yes')>-1||answer.toLowerCase().indexOf('yeah')>-1||answer.toLowerCase().indexOf('yup')>-1)  
      {
          session.send("Well, that's great! A person as awesome as me generally gets the job done.")
          session.send('Do you want to search some other topic')
      }     
  }    
]);
// Setup Restify Serverblahbahblahblah
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
