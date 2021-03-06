var u = require('d4-user');
var realmUser = require('d4-realmuser');
 

/* GET home page. */
exports.index = function (req, res) {
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

exports.roshambattle = function (req, res) {
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

exports.realms = function (req, res) {
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

exports.about = function (req, res) {
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

exports.joinRoshamWar = function (req, res) {
    if (typeof req.session.userID !== 'undefined') {
        realmUser.model.find({user: req.session.userID}, function (err, user) {
            if (err) {
                console.log('sumtin if fucked with joinRoshamWar');
                res.redirect('/fourohfour');
            } else {
                if (user.length > 0) {
                    res.render('roshamWar', {title: 'RochamWar!',
                                        displayName: req.session.displayName,
                                        userID: req.session.userID,
                                        nextTurn: req.app.get('job').nextInvocation()
                                        });
                } else {
                    res.render('joinRoshamWar', {title: 'Join RochamWar!',
                                        displayName: req.session.displayName,
                                        userID: req.session.userID,
                                        nextTurn: req.app.get('job').nextInvocation()
                                        });
                }
            }
        });
    } else {
        res.redirect('/login');
    }
};

exports.settings = function (req, res) {
    if (typeof req.session.userID !== 'undefined') {
        u.getUser({_id: req.session.userID}, function (err, data) {
            if (err) {
                res.status(500).json({result: 'error', reason: 'Sumtin went very wrong.'});
            } else {
                data.displayName = req.session.displayName;
                data.title = 'User Makeover';
                if (!data.mobile) {
                    data.mobile = '';
                }
                res.render('userSettings', data);
            }
        });
    } else {
        res.redirect('/login');
    }
};