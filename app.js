var express = require('express.io');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var io = require ('socket.io');
var MongoStore = require('connect-mongo')(express);
var schedule = require('node-schedule');
var turn = require('d4-roshamturn');

//routes
var routes = require('./routes');
var users = require('./routes/user');
var login = require('./routes/login');
var register = require('./routes/register');
var processTurn = require ('./routes/processTurn');
var messages = require('./routes/messages');

var app = express().http().io();

// connect to the database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/roshambattle');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
   console.log('Connected to Mongo'); 
});

var rule = new schedule.RecurrenceRule();
rule.minute = [0];
rule.hour = [0,12];

var j = schedule.scheduleJob(rule, function(){
    turn.generateTurn(function(err, data){
        if (data){
            console.log('I have generated a turn!!');            
        } else {
            console.log('I failed to generate a turn!!');
        }
    });      
});

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
app.get('/register', register.registerGet);
app.post('/register', register.registerPost);
app.get('/login', login.loginGet);
app.post('/login', login.loginPost);
app.get('/logout', users.logout);
app.io.route('selectWeapon', processTurn.selectWeapon);
app.io.route('taunt', messages.taunt);
app.io.route('getUserScore', users.getUserScore);
app.io.route('getTurns', users.getTurns);
app.get('/generateTurn', processTurn.generateTurn);

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
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
var server = app.listen(3000, function(){
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