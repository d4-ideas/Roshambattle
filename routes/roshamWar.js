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