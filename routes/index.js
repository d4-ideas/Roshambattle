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

exports.roshamWar = function(req, res){
    if (typeof req.session.userID !== 'undefined') {
        res.render('roshamWar', {title: 'RochamWar!',
                            displayName: req.session.displayName,
                            userID: req.session.userID,
                            nextTurn: req.app.get('job').nextInvocation()
                            });
    } else {
        res.redirect('/login');
    }
};