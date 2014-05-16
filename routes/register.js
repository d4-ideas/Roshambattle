var http = require('http');
var user = require('d4-user');

exports.registerGet = function (req, res) {
    res.render('register', { title: 'Registration' });
};

exports.registerPost = function (req, res) {
    console.log('enter registerPost');
    //req.session.username = req.body.emailAdddress;
    var crypto = require('crypto'),
        shaSum = crypto.createHash('md5'),
        password = req.body.password + 'd4bacon';
    
    shaSum.update(password);

    var returnData,
        hashedPassword = shaSum.digest('hex'),
        ourContent = {authentication:{type:'default',
                                      details: {emailAdddress: req.body.emailAddress,
                                      password: hashedPassword}},
                      displayName: req.body.displayName,
                      createdOn: Date.now()};
    console.log('call register');
    if (ourContent.displayName === 'ZTM'){
        ourContent = undefined;
    }
    user.register(ourContent, function(err, data){
        if (err){
            console.log('registerPost Error: ' + err);
            res.statusCode = 500;
            res.body = err;
        } else {
            console.log('registerPost Success');
            res.json = data;
        }
    });
};