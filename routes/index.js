/* GET home page. */
exports.index = function(req, res){
    if (typeof req.session.username !== 'undefined') {
        res.render('index', {title: 'Rochambattle',
                            displayName: req.session.displayName
                            });
    } else {
        res.redirect('/login');
    }
};
