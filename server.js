//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan'),
    fs      = require('fs'),
    path    = require('path'),
    bodyParser = require('body-parser');


var mongoose = require('mongoose');

var topicSchema = mongoose.Schema({
    chatId: String,
    topic: String,
    username: String
}); 

var Topic = mongoose.model('Topic', topicSchema);
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      if (err) {
        console.log('Error running count. Message:\n'+err);
      }
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    res.render('index.html', { pageCountMessage : null});
  }
});

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

app.get('/static/este.jpg', function (req, res) {
    var img = fs.readFileSync('./static/este.jpg');
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});

app.get('/static/elDeArmando.jpg', function (req, res) {
    var img = fs.readFileSync('./static/elDeArmando.jpg');
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});

app.get('/static/homerespermatozoide.gif', function (req, res) {
    var img = fs.readFileSync('./static/homerespermatozoide.gif');
    res.writeHead(200, {'Content-Type': 'image/gif' });
    res.end(img, 'binary');
});

app.get('/static/pagaron.gif', function (req, res) {
    var img = fs.readFileSync('./static/pagaron.gif');
    res.writeHead(200, {'Content-Type': 'image/gif' });
    res.end(img, 'binary');
});

var fnInfo = function(req,res){
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.end(JSON.stringify(sysInfo[url.slice(6)]()));
};

var fnText= function(req,res,text){
    var data = {
        'chat_id' : req.body.message.chat.id,
        'text': text
    };

    var request = require('request');
    var options = {
      uri: 'https://api.telegram.org/bot180447956:AAF50f54FuAWNrs077k7iPH6n1ngkLYjYrw/sendMessage',
      method: 'POST',
      json: data
    };
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    });
};

var fnResume= function(req,res){
    
    mongoose.connect('mongodb://admin:nH-qdHrKHUDF@127.2.103.130/interesante');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log("Connected to mongo db");
    });

    var text="Temas:\n";

    Topic.find({ chatId: req.body.message.chat.id },function (err, items) {
      if (err) {
        console.log(err);
      }else{
        var count=1;
        for(var item of items) {
           text+=count+'. '+item.topic+" - "+item.username+"\n";
           count+=1;
        }

        if(count==1){
          text="No estamos hablando de una monda careverga!.";
        }

        var data = {
            'chat_id' : req.body.message.chat.id,
            'text': text
        };

        var request = require('request');
        var options = {
          uri: 'https://api.telegram.org/bot180447956:AAF50f54FuAWNrs077k7iPH6n1ngkLYjYrw/sendMessage',
          method: 'POST',
          json: data
        };
        request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log(body);
          }
        });

      }
    });

    mongoose.connection.close()

};

var fnResetResume= function(req,res){
    
    mongoose.connect('mongodb://admin:nH-qdHrKHUDF@127.2.103.130/interesante');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log("Connected to mongo db");
    });

    var text="";

    Topic.remove({ chatId: req.body.message.chat.id },function (err, items) {
      if (err) {
        console.log(err);
      }else{
        console.log("items borrados: "+items.result.n);
        console.log(items);
        if(items.result.n==0){
          text="No hay nada que borrar IDIOTA!. Presta mas atencion al chat."
        }else{
          text="Se borro toda la info, si fue por error, te digo que LA CAGASTE IMBECIL.";
        }

        var data = {
            'chat_id' : req.body.message.chat.id,
            'text': text
        };

        var request = require('request');
        var options = {
          uri: 'https://api.telegram.org/bot180447956:AAF50f54FuAWNrs077k7iPH6n1ngkLYjYrw/sendMessage',
          method: 'POST',
          json: data
        };
        request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log(body);
          }
        });

      }
    });

    mongoose.connection.close()

};

var fnTopic= function(req,res,text){
    
    mongoose.connect('mongodb://admin:nH-qdHrKHUDF@127.2.103.130/interesante');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log("Connected to mongo db");
    });

    var item = new Topic({ chatId: req.body.message.chat.id, topic: text, username:  req.body.message.from.username });

    item.save(function (err, fluffy) {
      if (err) return console.error(err);
      console.log("Item Saved");
    });

    mongoose.connection.close()

    var data = {
        'chat_id' : req.body.message.chat.id,
        'text': 'Tema agregado!'
    };

    var request = require('request');
    var options = {
      uri: 'https://api.telegram.org/bot180447956:AAF50f54FuAWNrs077k7iPH6n1ngkLYjYrw/sendMessage',
      method: 'POST',
      json: data
    };
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    });
};

var fnSendPhoto= function(req,res,urlPhoto){

    var request = require('request');

    var formData = {
      'chat_id': req.body.message.chat.id,
      'photo': fs.createReadStream(urlPhoto)
    };

    request.post({url:'https://api.telegram.org/bot180447956:AAF50f54FuAWNrs077k7iPH6n1ngkLYjYrw/sendPhoto', formData: formData}, function(err, httpResponse, body) {
      if (err) {
        return console.error('upload failed:', err);
      }
      console.log('Upload successful!  Server responded with:', body);
    });

};

var fnInlineBlank= function(req,res,query_id){
    var data = {
        'inline_query_id' : query_id,
        'results': JSON.stringify([{'type':'photo','id':'123123','photo_url':'http://interesante-bot-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/este.jpg','thumb_url':'http://interesante-bot-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/este.jpg'}])
    };

    var request = require('request');
    var options = {
      uri: 'https://api.telegram.org/bot180447956:AAF50f54FuAWNrs077k7iPH6n1ngkLYjYrw/answerInlineQuery',
      method: 'POST',
      json: data
    };
    
    request(options, function (error, response, body) {
      console.log("body");
      console.log(body);
      console.log("error");
      console.log(error);
    });
};

var fnInlineAnswer= function(req,res,query_id){
    var data = {
        'inline_query_id' : query_id,
        'results': JSON.stringify(
                      [
                        {'type':'photo',
                          'id':'456456',
                          'photo_url':'http://interesante-bot-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/saxiwesly.jpg',
                          'thumb_url':'http://interesante-bot-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/saxiwesly.jpg'
                        },
                        {'type':'photo',
                          'id':'123123',
                          'photo_url':'http://interesante-bot-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/este.jpg',
                          'thumb_url':'http://interesante-bot-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/este.jpg'
                        },
                        {'type':'photo',
                          'id':'789789',
                          'photo_url':'http://interesante-bot-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/callate.jpg',
                          'thumb_url':'http://interesante-bot-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/callate.jpg'
                        },
                        {'type':'photo',
                          'id':'978908',
                          'photo_url':'http://interesante-bot-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/elDeArmando.jpg',
                          'thumb_url':'http://interesante-bot-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/elDeArmando.jpg'
                        },
                        {'type':'gif',
                          'id':'001202',
                          'gif_url':'http://interesante-bot-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/homerespermatozoide.gif',
                          'thumb_url':'http://interesante-bot-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/homerespermatozoide.gif'
                        },
                        {'type':'gif',
                          'id':'341202',
                          'gif_url':'http://interesante-bot-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/pagaron.gif',
                          'thumb_url':'http://interesante-bot-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/pagaron.gif'
                        }
                      ]
                      )
    };

    var request = require('request');
    var options = {
      uri: 'https://api.telegram.org/bot180447956:AAF50f54FuAWNrs077k7iPH6n1ngkLYjYrw/answerInlineQuery',
      method: 'POST',
      json: data
    };
    console.log("roger");
    console.log(options);
    request(options, function (error, response, body) {
      console.log("body");
      console.log(body);
      console.log("error");
      console.log(error);
    });
};

app.post('/', function(req,res){
  
  var text="";

console.log(req.body);

if (typeof req.body.message !== 'undefined' && typeof req.body.message.text !== 'undefined' && req.body.message.text )
{

if(req.body.message.text.startsWith('/interesante')){
    text = 'Que interesante lo que me cuentas '+req.body.message.text.substr('/interesante'.length+1,req.body.message.text.length)+", ojala te lo hubiera preguntado.";
    fnText(req,res,text);
}
if(req.body.message.text.startsWith('/eso')){
    text = 'Eso viejo '+req.body.message.text.substr('/eso'.length+1,req.body.message.text.length)+", eso.";
    fnText(req,res,text);
}
if(req.body.message.text.startsWith('/loanotare')){
    text = 'Lo anotare en mi libreta de cosas que me valen monda!';
    fnText(req,res,text);
}
if(req.body.message.text.indexOf('/este') > -1 || req.body.message.text.indexOf('/esta') > -1){
    var urlPhoto='./static/este.jpg';
    fnSendPhoto(req,res,urlPhoto);
}
if(req.body.message.text.startsWith('/help@InteresanteBot')){
    text = '/help - Muestra los comandos disponibles.\n/interesante - Muestra mensaje, interesante lo que me cuentas.\n/eso - Muestra mensaje, eso viejo.\n/saxi - Muestra WeslyFace.\n/este - Muestra meme.';
    fnText(req,res,text);
}
if(req.body.message.text.startsWith('/topic')){
    text = req.body.message.text.substr('/topic'.length+1,req.body.message.text.length);
    console.log(text)
    fnTopic(req,res,text);
}
if(req.body.message.text.startsWith('/resumen')){
    fnResume(req,res);
}
if(req.body.message.text.startsWith('/reset')){
  if(req.body.message.from.username==='Roger1345' || req.body.message.from.username==='handzath' || req.body.message.from.username==='miguelangel90'){
    fnResetResume(req,res);
  }else{
    fnText(req,res,"Eres esteril, no puedes borrar nada, malparido.");
  }
}

}

  if(typeof req.body.inline_query !== 'undefined' && typeof req.body.inline_query.query !== 'undefined'){

  console.log("Inline Query: "+req.body.inline_query.query);
  if(req.body.inline_query.query.length==0){
    console.log("query empty, "+req.body.inline_query.id);
    fnInlineAnswer(req,res,req.body.inline_query.id);
  }else{
    console.log("query sent");
  }

  }

  res.status(200).end();
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
