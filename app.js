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
var doc_count = 0

bot.dialog('/', [
    function(session) {
        builder.Prompts.text(session, 'Hey, I am your Cognitive Assistant. Ask me any question');
    },
    function(session, results, next) {   
    answer = results.response;
    if (answer.toLowerCase().indexOf('design parameters')>-1)
        {
            session.send("1. Structural Design<br>2. Control Systems<br>3. Plant Configuration<br>4. Power Distribution<br>5. Safety & Blowout<br>6. Jacket<br>7. Operating conditions<br>8. Environmental considerations");
            session.userData.flag = "initial flow"
            builder.Prompts.text(session, "What else do you want to know?")
        }
    else{
        session.userData.flag = answer
        next()
    }
    },

    function(session, results)
    {
    if(!(session.userData.flag=="initial flow"))
    relevant = session.userData.flag
    else
    relevant = results.response;
    relevant.replace('?',"")
    relevant = relevant.replace(/ is| what|what| a | are| the| or| in| of| be| case|show| show|want| documents| get|get| me| some| on| relating/gi,"")
    relevant = relevant.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    greetings.callRAPI("/index?doc=" + relevant, function(err,data){
    if (err) console.log(err);
    else 
    {
        // doc_count = 0 
        obj1 = JSON.parse(data);       
        
        // while(obj1[doc_count]['scores']>0.80){
        //     doc_count++
        // }
        //if(!doc_count == 0)
        //{
        session.send("Top matching results: ")
        var i 
        for(i=0;i<5;i++)
        {                  
        //session.send("%s", obj1[i]['url']) 
          doc_name = obj1[i]['url'].substring(obj1[i]['url'].lastIndexOf('/') + 1, obj1[i]['url'].length)
          score = Number(obj1[i]['scores'])
          score = Math.floor(score*100)    
          session.send("Document name - " + doc_name +  "<br>" + "Relevance - " + score + "%" + "<br>" + "Document url - " + obj1[i]['url'])            
        }
        doc_count = 5
        builder.Prompts.text(session, 'Did you find what you were looking for?');        //console.log(data);       
    //}
    // else{
    //     session.send("Sorry, there were no matching results")
    // }
    }
});    
    },

    function(session, results){
       answer = results.response
       if(answer.toLowerCase().indexOf('no')>-1||answer.toLowerCase().indexOf('not')>-1||answer.toLowerCase().indexOf('nope')>-1) 
        {
             session.send("All right, I'll render some more documents for you. They are")
             session.send("Here you go: ")
       
            for(i=doc_count;i<doc_count + 5;i++){                  
            //session.send("%s", obj1[i]['url']) 
                doc_name = obj1[i]['url'].substring(obj1[i]['url'].lastIndexOf('/') + 1, obj1[i]['url'].length)
                score = Number(obj1[i]['scores'])
                score = Math.floor(score*100)    
                session.send("Document name - " + doc_name +  "<br>" + "Relevance - " + score + "%" + "<br>" + "Document url - " + obj1[i]['url'])                 
            }
        builder.Prompts.text(session, 'Did you find what you were looking for this time?');        
        }
      else if(answer.toLowerCase().indexOf('yes')>-1||answer.toLowerCase().indexOf('yeah')>-1||answer.toLowerCase().indexOf('yup')>-1)  
      {
          session.send("Well, that's great! Happy to help.")
          
      }      
    },

  function(session, results){
       answer = results.response
       if(answer.toLowerCase().indexOf('no')>-1||answer.toLowerCase().indexOf('not')>-1||answer.toLowerCase().indexOf('nope')>-1) 
        {
             session.send("I'll render some more documents for you.")
             session.send("Here you go: ")
       
            for(i=doc_count + 5;i<doc_count + 9;i++){                  
            //session.send("%s", obj1[i]['url']) 
              score = Number(obj1[i]['scores'])
              score = Math.floor(score*100)    
              session.send("Document name - " + doc_name +  "<br>" + "Relevance - " + score + "%" + "<br>" + "Document url - " + obj1[i]['url'])               
            }
        builder.Prompts.text(session, 'Hope you found it this time!');       
        }
        else if(answer.toLowerCase().indexOf('yes')>-1||answer.toLowerCase().indexOf('yeah')>-1||answer.toLowerCase().indexOf('yup')>-1)  
      {
          session.send("Well, that's great! Happy to help.")
         
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
          session.send("Well, that's great! Happy to help.")        
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
 // adding changes yoyo