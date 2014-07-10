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
    turn.getTurns({numberOfTurns:5,userID:req.session.userID}, function(err, data){
        if(err)
            req.io.emit('getTurnsFailure', 'Failed to get the turns for you: ' +  err.error);
        else{
            var num = data.length,
                i = 0,
                turns = new Array();
            turns.length = num;
            data.forEach(function(element){
                turns[element.turnDate]='';
                result.getUserTurnResults ({turnDate:element.turnDate, userID:req.session.userID}, function(err, data) {
                    if (err)
                        req.io.emit('getTurnsFailure', 'Failed to get the results for you: ' +  err.error);
                    else {
                        turns[i++] = data;
                        if (--num === 0) {
                            turns.sort(function(a,b){
                                var date1 = new Date(a.turnDate),
                                    date2 = new Date(b.turnDate);
                                return date2-date1;
                            }); 
                            req.io.emit('getTurns', turns);
                        }
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