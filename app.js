var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var io = require ('socket.io');
var MongoStore = require('connect-mongo')(express);

//routes
var routes = require('./routes');
var users = require('./routes/user');
var login = require('./routes/login');
var logout = require('./routes/logout');
var register = require('./routes/register');
var processTurn = require ('./routes/processTurn');

var app = express();

// connect to the database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/roshambattle');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
   console.log('Connected to Mongo'); 
});

//*******************************************
//Testing Station
// userid 5379651cc759b5480b56c8e6
// userid 53757be81b180608167613cc
// userid 53757a9297f781bc2153bae2
//
var testTurn = require('d4-roshamturn');
var testUser = require('d4-roshamuser');
//testUser.setWeapon({'userid':'5379651cc759b5480b56c8e6', 'weapon':'Scissors'}, function(err, success){if(err){ console.log(err.error)} else {console.log(success)}});
//testUser.setWeapon({'userid':'53757be81b180608167613cc', 'weapon':'Rock'}, function(err, success){if(err){ console.log(err.error)} else {console.log(success)}});
//testUser.setWeapon({'userid':'53757a9297f781bc2153bae2', 'weapon':'Rock'}, function(err, success){if(err){ console.log(err.error)} else {console.log(success)}});
//
//testUser.getRoshamUser('53757a9297f781bc2153bae2',  function(err, success){if(err){ console.log(err.error)} else {console.log(success)}});
//
//testTurn.generateTurn(function(err, success){if(err){ console.log(err.error)} else {console.log(success)}});
//*******************************************

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
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
app.get('/users', users.list);
app.get('/register', register.registerGet);
app.post('/register', register.registerPost);
app.get('/login', login.loginGet);
app.post('/login', login.loginPost);
app.get('/logout', logout.logout);
app.post('/selectWeapon', processTurn.selectWeapon);
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
    console.log('         / 3 \\');
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

//var serv_io = io.listen(server);
//serv_io.sockets.on('connection', function(socket){
//	socket.emit('Result', {you: 'lost'});
//	socket.on('Message', function(data) {
//		console.log(data);
//	});
//});
