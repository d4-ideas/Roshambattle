var user = require('d4-roshamuser');

exports.getUserScore = function(req){
    user.getRoshamUser(req.session.userID, function(err, data){
        if(data)
            req.io.emit('UserScoreSuccess',data);
        else
            req.io.emit('UserScoreFailure',err);
    });    
};

exports.getTurns = function(req){
    req.io.emit('getOneTurn', '');
};

exports.logout = function (req, res) {
    res.clearCookie('app.sess');
    res.redirect('/login');
};