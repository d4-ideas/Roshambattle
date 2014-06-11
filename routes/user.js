console.log('user');
var user = require('d4-roshamuser');
var turn = require('d4-roshamturn');

exports.getUserScore = function(req){
    user.getRoshamUser(req.session.userID, function(err, data){
        if(data)
            req.io.emit('UserScoreSuccess',data);
        else
            req.io.emit('UserScoreFailure',err);
    });    
};

exports.getTurns = function(req){
    turn.getTurns({numberOfTurns:5,userID:req.session.userID}, function(err, data){
        if(err)
            req.io.emit('getTurnsFailure', 'Failed to get the turns for you: ' +  err.error);
        else{
            data.forEach(function(element){
                //testResult.getTurnResults({element.turnDate}, function(err,data){
                    req.io.emit('getOneTurn', element.turnDate); 
                //});                
            });
            
        }
    });
};

exports.logout = function (req, res) {
    res.clearCookie('app.sess');
    res.redirect('/login');
};