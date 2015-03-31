var express = require('express.io');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(express);
var schedule = require('node-schedule');
var turn = require('d4-roshamturn');
var leaderBoard = require('d4-roshamleader');

//routes
var routes = require('./routes');
var users = require('./routes/user');
var login = require('./routes/login');
var roshamUser = require('./routes/roshamUser');
var processTurn = require ('./routes/processTurn');
var messages = require('./routes/messages');
var leaderboard = require('./routes/leaderboard');
var realmDesign = require('./routes/realmDesign');
var realmExplore = require('./routes/realmExplore');
var fourohfour = require('./routes/fourohfour.js');
var roshamWar = require('./routes/roshamWar');

var app = express().http().io();

// connect to the database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/roshambattle');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
   console.log('Connected to Mongo'); 
});

// connect up our socket utilities
var socketUtil = require('d4-sockets');
socketUtil.initialize(app);

var rule = new schedule.RecurrenceRule();
rule.minute = [0];
rule.hour = [0,2,4,6,8,10,12,14,16,18,20,22];

var j = schedule.scheduleJob(rule, function(){
    turn.generateTurn(function(err, data){
        if (data){
            console.log('I have generated a turn!!');            
            leaderBoard.genScores();
        } else {
            console.log('I failed to generate a turn!!');
        }
    });      
});
app.set('job', j);

app.set('port', process.env.PORT || 80);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.cookieParser());
app.use(express.session({
    key: 'app.sess',
    store: new MongoStore({
        db: 'Sessions',
        host: 'localhost',
        port: 27017
    }),
    secret: 'zuperzecret here',
        //one day=24 * 60 * 60 * 1000
    cookie: {maxAge: 24 * 60 * 60 * 1000 * 365}
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/roshambattle', routes.roshambattle);
app.get('/realms', routes.realms);
app.get('/register', users.registerGet);
app.post('/register', users.registerPost);
app.get('/login', login.loginGet);
app.post('/login', login.loginPost);
app.get('/forgotPassword', login.forgotPasswordGet);
app.post('/forgotPassword', login.forgotPasswordPost);
app.get('/rememberPassword', login.rememberPasswordGet);
app.post('/rememberPassword', login.rememberPasswordPost);
app.get('/logout', users.logout);
app.get('/userSettings', routes.settings); 
app.get('/joinRoshamWar', routes.joinRoshamWar);
app.get('/roshamWar', roshamWar.roshamWar);
//app.get('/lowerEmails', users.lowerEmails);
app.io.route('selectWeapon', processTurn.selectWeapon);
app.io.route('taunt', messages.taunt);
app.io.route('getChats', messages.getChats);
app.io.route('addPlus', messages.addPlus);
app.io.route('addMinus', messages.addMinus);

app.io.route('getUserScore', roshamUser.getUserScore);
app.io.route('getTurns', roshamUser.getTurns);

app.io.route('updateUser', users.updateUser);
app.io.route('changePassword', users.changePassword);

app.io.route('getLeaderBoard', leaderboard.getLeaderBoard);
app.get('/generateTurn', processTurn.generateTurn);

app.io.route('getNodes', realmDesign.getNodes);
app.io.route('createConnection', realmDesign.createConnection);
app.io.route('removeNode', realmDesign.removeNode);
app.io.route('navToLoc', realmExplore.navToLoc);
app.io.route('getRoshamWarUserView', roshamWar.getRoshamWarUserView);
app.io.route('updateRoshamWarTurn', roshamWar.updateRoshamWarTurn);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('fourohfour', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('fourohfour', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
var server = app.listen(app.get('port'), function(){
    console.log('          / \\');
    console.log('         / 4 \\');
    console.log('        /     \\');
    console.log('       /       \\');
    console.log('      /   d 4   \\');
    console.log('     /   ideas   \\');
    console.log('    /             \\');
    console.log('   /               \\');
    console.log('  / 1             2 \\');
    console.log(' /___________________\\');
	console.log('Listening on port %d', server.address().port);
    console.log('Press ctrl+c to exit');
});

//Anthony hacking here - please leave it alone
var passTheWord = function(theTurnDate){
	//iterate through our connections
	for (connection in app.io.connected){
		if (app.io.connected.hasOwnProperty(connection)){
			//get the turn info here...
			getUserTurnResults({turnDate : turnDate, userID : theUserId}, function(data){
				app.io.sockets.sockets[connection].emit('turnResult', {who: 'god', what : 'I see you ' + app.io.handshaken[connection].session.displayName});
			});
			//send them a message
		}
	}
};

//setInterval(function(){passTheWord('foo')}, 10000);
//setInterval(function(){passTheWord('foo')}, 10000);