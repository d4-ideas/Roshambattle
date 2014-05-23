/* GET home page. */
exports.index = function(req, res){
    if (typeof req.session.username !== 'undefined') {
        res.render('index', { title: 'Rochambattle' });
    } else {
        res.redirect('/login');
    }

	res.render('index', { title: 'Express' });
};
