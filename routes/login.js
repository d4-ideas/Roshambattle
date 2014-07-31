var user = require('d4-user');

exports.loginGet = function (req, res) {
    //Should we check session state and pass through if they user already has a valid session?
    console.log('get login');
    res.render('login', { title: 'Login' });
};

exports.loginPost = function (req, res) {
    
    //calcuate our hashed password
    var crypto = require('crypto'),
        shaSum = crypto.createHash('md5'),
        password = req.body.password + 'd4bacon';
    
    shaSum.update(password);

    var returnData,
        hashedPassword = shaSum.digest('hex');

    user.getUser({email: req.body.emailAddress.toLowerCase()}, function(err, data){
        if(err){
            console.log('there was an error');
            console.log(err);
            res.status(500).json({result:'error', reason: err.error});                
        }
        else {
            if (hashedPassword === data.password){
                //put back any session variables we need.
                req.session.emailAddress = req.body.emailAddress;
                req.session.displayName = data.name;
                req.session.userID = data._id;
                //return success to the client
                res.json({result:'ok'});   
            }
            else {
                res.status(500).json({result:'error', reason: 'Try again fat fingers.'});
            }
        }
    });
};