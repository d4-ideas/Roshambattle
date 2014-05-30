var user = require('d4-roshamuser');

exports.getUserScore = function(req){
    console.log('caught the event');
    user.getRoshamUser(req.session.userID, function(err, data){
        if(data)
            req.io.emit('UserScoreSuccess',data);
        else
            req.io.emit('UserScoreFailure',err);
    });    
};