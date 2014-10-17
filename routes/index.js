var realmUser = require('d4-realmUser');
 

/* GET home page. */
exports.index = function(req, res){
    if (typeof req.session.userID !== 'undefined') {
        res.render('index', {title: 'Rochambattle',
                            displayName: req.session.displayName,
                            userID: req.session.userID,
                            nextTurn: req.app.get('job').nextInvocation()
                            });
    } else {
        res.redirect('/login');
    }
};

exports.roshambattle = function(req, res){
    if (typeof req.session.userID !== 'undefined') {
        res.render('roshambattle', {title: 'Rochambattle',
                            displayName: req.session.displayName,
                            userID: req.session.userID,
                            nextTurn: req.app.get('job').nextInvocation()
                            });
    } else {
        res.redirect('/login');
    }
};

exports.realms = function(req, res){
    if (typeof req.session.userID !== 'undefined') {
        res.render('realms', {title: 'Realms',
                            displayName: req.session.displayName,
                            userID: req.session.userID,
                            nextTurn: req.app.get('job').nextInvocation()
                            });
    } else {
        res.redirect('/login');
    }
};

exports.about = function(req, res){
    if (typeof req.session.userID !== 'undefined') {
        res.render('about', {title: 'Rochambattle',
                            displayName: req.session.displayName,
                            userID: req.session.userID,
                            nextTurn: req.app.get('job').nextInvocation()
                            });
    } else {
        res.redirect('/login');
    }
};

exports.joinRoshamWar = function(req, res){
    if (typeof req.session.userID !== 'undefined') {
        realmUser.model.find({user:req.session.userID}, function(err, user){
            if(err){
                console.log('sumtin if fucked with joinRoshamWar');
                res.redirect('/');
            }
            else{
                if (user.length > 0)
                    res.render('roshamWar', {title: 'RochamWar!',
                                        displayName: req.session.displayName,
                                        userID: req.session.userID,
                                        nextTurn: req.app.get('job').nextInvocation()
                                        });    
                else
                    res.render('joinRoshamWar', {title: 'Join RochamWar!',
                                        displayName: req.session.displayName,
                                        userID: req.session.userID,
                                        nextTurn: req.app.get('job').nextInvocation()
                                        });
                            
            }
        });
    } else {
        res.redirect('/login');
    }
};