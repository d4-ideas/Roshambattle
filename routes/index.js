/* GET home page. */
exports.index = function(req, res){
    console.log(req.app.get('job').nextInvocation());
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
