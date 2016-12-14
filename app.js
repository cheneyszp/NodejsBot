var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://api.projectoxford.ai/luis/v2.0/apps/YOUR_LUIS_APP_ID?subscription-key=YOUR_LUIS_KEY&verbose=true';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

// Add intent handlers
dialog.matches('查询天气',[
    function(session,args,next){
        var location = builder.EntityRecognizer.findEntity(args.entities, '地点');
        if (!location) {
            builder.Prompts.text(session, '请问您要查询的天气的地点是哪里?');
        } else {  
            next({ response: location.entity });
        }
    },
    function (session, results) {
        if (results.response) {
            // ... 在这里添加您自己的业务逻辑
            session.send(" %s 现在天气不错", results.response);
        } else {
            session.send('出错了。。。。');
        }
        
    }
]);
dialog.matches('查询股票',[
    function(session,args,next){
        var location = builder.EntityRecognizer.findEntity(args.entities, '股票代码');
        if (!location) {
            builder.Prompts.text(session, '请问您要查询的股票是哪只代码呢？把股票代码发给我哈');
        } else {  
            next({ response: location.entity });
        }
    },
    function (session, results) {
        if (results.response) {
            // ... 在这里添加您自己的业务逻辑
            session.send(" %s 现在股价是。。。就不告诉你！", results.response);
        } else {
            session.send('出错了。。。。');
        }
        
    }
]);
dialog.matches('问候', builder.DialogAction.send('你好'));
dialog.onDefault(builder.DialogAction.send("不好意思，我不知道你在说什么."));