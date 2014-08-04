console.log('mochahooks');
var mongoose = require('mongoose');
var ruser = require('d4-roshamuser');
var user = require('d4-user');
var testTurn = require('d4-roshamturn');
var testResult = require('d4-roshamresult');
var rockUser = {email: 'rockuser@email.com',
                    password: 'testuser',
                    name: 'RockUser'},
    paperUser = {email: 'paperuser@email.com',
                    password: 'testuser',
                    name: 'PaperUser'};

before(function(done){
    // connect to the database
    mongoose.connect('mongodb://localhost/roshambattle');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback(){
       console.log('Connected to Mongo');
    });
    
    var i = 0,
        checkDone = function(){
            i++;
            console.log('checkDone' + i);
            if (i === 2) done();
        }
    user.userModel.create(rockUser, paperUser)
    .then(function(rock, paper){
        var rRock = {'userid': rock._id,
                   'weapon': 'Rock',
                   'totalBattles': 4,
                   'totalWins': 4,
                   'totalLosses': 0,
                   'totalTies': 0},
            rPaper = {'userid': paper._id,
                   'weapon': 'Paper',
                   'totalBattles': 4,
                   'totalWins': 0,
                   'totalLosses': 4,
                   'totalTies': 0};
        ruser.roshamuserModel.create(rRock, rPaper)
        .then(checkDone); 
        var turn1 = {turnDate: new Date("May 21, 2014 8:00:00"),
                     participants: [{userid: rock._id, weapon: 'Rock'}, {userid: paper._id, weapon: 'Paper'}]},
            turn2 = {turnDate: new Date("May 21, 2014 9:00:00"),
                     participants: [{userid: rock._id, weapon: 'Rock'}, {userid: paper._id, weapon: 'Paper'}]},
            turn3 = {turnDate: new Date("May 21, 2014 10:00:00"),
                     participants: [{userid: rock._id, weapon: 'Rock'}, {userid: paper._id, weapon: 'Paper'}]},
            turn4 = {turnDate: new Date("May 30, 2014 9:00:00"),
                     participants: [{userid: rock._id, weapon: 'Rock'}, {userid: paper._id, weapon: 'Paper'}]};
        console.log(turn1);
        testTurn.model.create(turn1, turn2, turn3, turn4)
        .then(checkDone);
    });  
});


after(function(){
    console.log('enter after');
    user.userModel.remove ({password:rockUser.password}, function(err,res){
        if (err) throw new Error ('Failed to remove existingUser');
        else console.log('remove users');
        done();
    });
    
    ruser.roshamuserModel.remove(null, function(err, res){
        if (err || res <1) {
            console.log('error removing test roshamusers ' + err + res + existingUser.password);
        }
    });
    
    testTurn.model.remove(null, function(err, res){
        if (err || res <1) {
            console.log('error removing test roshamturns ' + err + res + existingUser.password);
        }
    });
    
    testResult.model.remove(null, function(err, res){
        if (err || res <1) {
            console.log('error removing test roshamresultss ' + err + res + existingUser.password);
        }
    });
});