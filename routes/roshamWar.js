var realmUser = require('d4-realmuser');
 
exports.roshamWar = function(req, res){
    if (typeof req.session.userID !== 'undefined') {
        realmUser.joinGame({userid:req.session.userID}, function(err, data){
            if (err){
                console.log('You really fucked joinGame up this time');
                res.render('fourohfour', {
                    message: 'You really fucked joinGame up this time',
                    error: {}
                });
            } else 
                if (data) {
                res.render('roshamWar', {title: 'RochamWar!',
                                    displayName: req.session.displayName,
                                    userID: req.session.userID,
                                    nextTurn: req.app.get('job').nextInvocation()
                                    });
                }
                else {
                    console.log('Forget about joining the game');
                    res.render('fourohfour', {
                        message: 'Forget about joining the game',
                        error: {}
                    });             
                }
        });
    } else {
        res.redirect('/login');
    }
};