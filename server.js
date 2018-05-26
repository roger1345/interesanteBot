//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan'),
    fs      = require('fs'),
    path    = require('path'),
    http = require('http'),
    Telegraf = require('telegraf'),
    bodyParser = require('body-parser'),
    Telegraf = require('telegraf');

const Extra = require('telegraf/extra')
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

var mongoose = require('mongoose');
var changingPhoto=false;

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
      mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
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

bot.command('interesante', (ctx) => {
  return ctx.replyWithMarkdown("Que interesante lo que me cuentas *"+ctx.ufs.readFileSyncpdate.message.text.substr('/interesante'.length+1,ctx.update.message.text.length)+"*, ojala te lo hubiera preguntado.", Extra.markdown());
});

bot.command('eso', (ctx) => {
  return ctx.replyWithMarkdown("Eso viejo *"+ctx.update.message.text.substr("/eso".length+1,ctx.update.message.text.length)+"*, eso.", Extra.markdown());
});

bot.command('loanotare', (ctx) => {
  return ctx.reply("Lo anotare en mi libreta de cosas que me valen monda!");
});

bot.hears(new RegExp(/\/(\besta\b|\b\este\b)/i), (ctx) => {
  return ctx.replyWithPhoto({ source: fs.createReadStream('./static/este.jpg') });
});

bot.hashtag(['problemasEnElParaiso','problemasenelparaiso'], (ctx) => {
  return ctx.reply("Yerda!!!!!");
});

bot.hashtag(['siganEnEstudio','siganenestudio'], (ctx) => {
  return ctx.reply("Que va cachon!!!!!");
});

bot.command('help', (ctx) => {
  return ctx.replyWithMarkdown("*/help* - Muestra los comandos disponibles.\n*/interesante* - Muestra mensaje, interesante lo que me cuentas.\n*/eso* - Muestra mensaje, eso viejo.\n*/este* - Muestra meme.\n*/esta* - Muestra meme.", Extra.markdown());
});

bot.command('titulo', (ctx) => {
  var text= ctx.update.message.text.substr('/titulo'.length+1,ctx.update.message.text.length);
  bot.telegram.setChatTitle(ctx.update.message.chat.id, text).catch((error)=>{
    bot.telegram.sendMessage(ctx.update.message.chat.id, "Error, verifica que el bot este como admin *imbecil*", Extra.markdown());
  });
});

bot.command('fotomes', (ctx) => {
  console.log(ctx.update)
  changingPhoto=true;
  return ctx.replyWithMarkdown("Manda la foto pue, Suedtala!!", Extra.markdown());
});

bot.command('tema', (ctx) => {
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('topic');
    var text= ctx.update.message.text.substr('/tema'.length+1,ctx.update.message.text.length);
    col.insert({chat_id: ctx.update.message.chat.id, topic: text, username:  ctx.update.message.from.username});
    console.log("Item Saved");
    return ctx.replyWithMarkdown("Tema agregado *estupido!*", Extra.markdown());
  }
});

bot.command('resumen', (ctx) => {
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('topic');
    // Create a document with request IP and current time of request
    col.find({chat_id: ctx.update.message.chat.id}).toArray(function(err, items) {
      var text="Temas:\n";

      if (err) {
        console.log(err);
      }else{
        var count=1;
        for(var item of items) {
           text+=count+'. '+item.topic+" - *"+item.username+"*\n";
           count+=1;
        }

        if(count==1){
          text="No estamos hablando de una monda *careverga!*.";
        }
        console.log(text);
        bot.telegram.sendMessage(ctx.update.message.chat.id, text, Extra.markdown());
      }
    });
  }
});

var fnSendPhoto= function(ctx, urlPhoto){

  var request = require('request');

  var formData = {
    'chat_id': ctx.update.message.chat.id,
    'photo': fs.createReadStream(urlPhoto)
  };

  request.post({url:'https://api.telegram.org/bot180447956:AAF50f54FuAWNrs077k7iPH6n1ngkLYjYrw/setChatPhoto', formData: formData}, function(err, httpResponse, body) {
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
  });

};

bot.command('reset', (ctx) => {
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('topic');
    // Create a document with request IP and current time of request
    col.remove({chat_id: ctx.update.message.chat.id});
    
    return ctx.replyWithMarkdown("Se borro toda la info, si fue por error, te digo que *LA CAGASTE IMBECIL.*", Extra.markdown());
  }
});
bot.on('photo', (ctx) => {
  console.log(ctx.update.message.photo);
  if(changingPhoto){
    changingPhoto=false;
    //console.log(bot.telegram.getFile(ctx.update.message.photo[0].file_id));
    bot.telegram.getFileLink(ctx.update.message.photo[2].file_id).then((urlPhoto)=>{
      console.log(urlPhoto);
      download(urlPhoto, 'static/'+path.parse(urlPhoto).base, function(){
        console.log('done');
        fnSendPhoto(ctx, "./static/"+path.parse(urlPhoto).base);
      });
    });
  }
});

var download = function(uri, filename, callback){
  var request = require('request');
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

bot.on('inline_query', (ctx) => {
  var result = [
                    {'type':'photo',
                      'id':'123123',
                      'photo_url':'https://bot-secure-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/este.jpg',
                      'thumb_url':'https://bot-secure-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/este.jpg'
                    },
                    {'type':'photo',
                      'id':'978908',
                      'photo_url':'https://bot-secure-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/elDeArmando.jpg',
                      'thumb_url':'https://bot-secure-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/elDeArmando.jpg'
                    },
                    {'type':'gif',
                      'id':'001202',
                      'gif_url':'https://bot-secure-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/homerespermatozoide.gif',
                      'thumb_url':'https://bot-secure-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/homerespermatozoide.gif'
                    },
                    {'type':'gif',
                      'id':'341202',
                      'gif_url':'https://bot-secure-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/pagaron.gif',
                      'thumb_url':'https://bot-secure-interesante-bot.7e14.starter-us-west-2.openshiftapps.com/static/pagaron.gif'
                    }
                  ];
  bot.telegram.answerInlineQuery(ctx.inlineQuery.id,result)
})

app.use(bot.webhookCallback('/'))

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
