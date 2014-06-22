var user = require('d4-roshamuser');
var turn = require('d4-roshamturn');
var result = require('d4-roshamresult');

exports.getUserScore = function(req){
    user.getRoshamUser(req.session.userID, function(err, data){
        if(data)
            req.io.emit('UserScoreSuccess',data);
        else
            req.io.emit('UserScoreFailure',err);
    });    
};



exports.getTurns = function(req){
    console.log('enter getturns');
    turn.getTurns({numberOfTurns:5,userID:req.session.userID}, function(err, data){
        console.log('lenght of array' + data.length);
        if(err)
            req.io.emit('getTurnsFailure', 'Failed to get the turns for you: ' +  err.error);
        else{
            data.forEach(function(element){

//                var aResult = {turnDate: element.turnDate, 
//                              userID: 123, 
//                              weapon: 'Rock', 
//                              opponents: [{name:'Billy Bob', result:'Win'},
//                                          {name:'Joey Johnson', result:'Tie'},
//                                          {name:'Happy', result:'Tie'},
//                                          {name:'Grr', result: 'Loss'}]
//                            }
//                    req.io.emit('getOneTurn', aResult); 
                result.getUserTurnResults ({turnDate:element.turnDate, userID:req.session.userID}, function(err, data) {
                    if (err)
                        req.io.emit('getTurnsFailure', 'Failed to get the results for you: ' +  err.error);
                    else {
                        console.log(data);
                        req.io.emit('getOneTurn', data);
                    }
                }); 
        
            });
            
        }
    });
};

exports.logout = function (req, res) {
    res.clearCookie('app.sess');
    res.redirect('/login');
};