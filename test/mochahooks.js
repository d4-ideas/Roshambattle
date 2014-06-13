var mongoose = require('mongoose');
var ruser = require('d4-roshamuser');
var user = require('d4-user');
var testTurn = require('d4-roshamturn');
var testResult = require('d4-roshamresult');
var rockUser = {email: 'RockUser@email.com',
                    password: 'testuser',
                    name: 'RockUser'},
    paperUser = {email: 'PaperUser@email.com',
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
    
    user.userModel.create(rockUser, paperUser)
    .then(function(rock, paper){
        var rRock = {'userid': rock._id,
                   'weapon': 'Rock',
                   'totalBattles': 0,
                   'totalWins': 0,
                   'totalLosses': 0,
                   'totalTies': 0},
            rPaper = {'userid': paper._id,
                   'weapon': 'Paper',
                   'totalBattles': 0,
                   'totalWins': 0,
                   'totalLosses': 0,
                   'totalTies': 0};
        ruser.roshamuserModel.create(rRock, rPaper)
        .then(function(){
            done();
        }); 
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