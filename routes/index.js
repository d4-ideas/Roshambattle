/* GET home page. */
exports.index = function(req, res){
    if (typeof req.session.userID !== 'undefined') {
        res.render('index', {title: 'Rochambattle',
                            displayName: req.session.displayName,
                            userID: req.session.userID
                            });
    } else {
        res.redirect('/login');
    }
};
