var http = require('http');
var user = require('d4-user');

exports.registerGet = function (req, res) {
    res.render('register', { title: 'Registration' });
};

exports.registerPost = function (req, res) {
    console.log('enter registerPost');
    req.session.username = req.body.emailAdddress;
    var crypto = require('crypto'),
        shaSum = crypto.createHash('md5'),
        password = req.body.password + 'd4bacon';
    
    shaSum.update(password);

    var returnData,
        hashedPassword = shaSum.digest('hex'),
        ourContent = {emailAddress: req.body.emailAddress,
                      password: hashedPassword,
                      displayName: req.body.displayName};
    console.log('call register');

    user.register(ourContent, function(err, data){
        if (err){
            //should improve error cases
            res.status(500).json({result:'error', reason:'The call to user.register failed.  Here is the reason: ' + err.error});
        } else {
            req.session.userID = data._id;
            res.json({result:'ok'});
        }
    });
};