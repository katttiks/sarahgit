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


//var obj1

var obj1
var relevant
var doc_count

bot.dialog('/', [
    function(session) {
        builder.Prompts.text(session, 'Hey, I am your COGNITIVE Assistant.I talk and I know things. Ask me any question');
    },

    function(session, results) {
    relevant = results.response;
    relevant.replace('?',"")
    relevant = relevant.replace(/ is| what|what| a | are| the| or| in| of| be| case|show| show|want| documents| get|get| me| some| on| relating/gi,"")
    relevant = relevant.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    greetings.callRAPI("/index?doc=" + relevant, function(err,data){
    if (err) console.log(err);
    else 
    {
        doc_count = 0 
        obj1 = JSON.parse(data);       
        
        while(obj1[doc_count]['scores']>0.70){
            doc_count++
        }
        if(!doc_count == 0)
        {
        session.send(doc_count + " cognitive search results found. They are: ")
        var i 
        for(i=0;i<doc_count;i++)
        {                  
        //session.send("%s", obj1[i]['url']) 
          doc_name = obj1[i]['url'].substring(obj1[i]['url'].lastIndexOf('/') + 1, obj1[i]['url'].length)         
           session.send(doc_name +  "<br>" + obj1[i]['url'])            
        }
        
        builder.Prompts.text(session, 'Did you find what you were looking for?');        //console.log(data);       
    }
    else{
        session.send("Sorry, there were no matching results")
    }
    }
});    
    },

    function(session, results){
       answer = results.response
       if(answer.toLowerCase().indexOf('no')>-1||answer.toLowerCase().indexOf('not')>-1||answer.toLowerCase().indexOf('nope')>-1) 
        {
             session.send("All right, I'll render some more documents for you.")
             session.send("Here you go: ")
       
            for(i=doc_count;i<9;i++){                  
            //session.send("%s", obj1[i]['url']) 
                doc_name = obj1[i]['url'].substring(obj1[i]['url'].lastIndexOf('/') + 1, obj1[i]['url'].length)           
                session.send(doc_name +  "<br>" + obj1[i]['url'])                 
            }
        builder.Prompts.text(session, 'Did you find what you were looking for this time?');        
        }
      else if(answer.toLowerCase().indexOf('yes')>-1||answer.toLowerCase().indexOf('yeah')>-1||answer.toLowerCase().indexOf('yup')>-1)  
      {
          session.send("Well, that's great! Happy to help. Cognitively Yours")
          
      }      
    },

  function(session, results){
       answer = results.response
       if(answer.toLowerCase().indexOf('no')>-1||answer.toLowerCase().indexOf('not')>-1||answer.toLowerCase().indexOf('nope')>-1) 
        {
             session.send("I'll render some more documents for you.")
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
          session.send("Well, that's great! Happy to help. Cognitively Yours!")
         
      }     
  },
  function(session, results){
      answer = results.response
      if(answer.toLowerCase().indexOf('no')>-1||answer.toLowerCase().indexOf('not')>-1||answer.toLowerCase().indexOf('nope')>-1)
      {
           session.send("Well, that's all the information I have.Ping me if you need help with some other topic.")
      }
      else if(answer.toLowerCase().indexOf('yes')>-1||answer.toLowerCase().indexOf('yeah')>-1||answer.toLowerCase().indexOf('yup')>-1)  
      {
          session.send("Well, that's great! Happy to help. Cognitively Yours!")        
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
