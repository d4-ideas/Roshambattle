var u = require('d4-user');


var hashPwd = function (password) {
    var crypto = require('crypto'),
        shaSum = crypto.createHash('md5');
    password = password + 'd4bacon';
    
    shaSum.update(password);
    return shaSum.digest('hex');
};

exports.registerGet = function (req, res) {
    res.render('register', { title: 'Registration' });
};

exports.registerPost = function (req, res) {
    console.log('enter registerPost');
    req.session.emailAddress = req.body.emailAdddress;
    req.session.displayName = req.body.displayName;

    var returnData,
        hashedPassword = hashPwd(req.body.password),
        ourContent = {emailAddress: req.body.emailAddress,
                      password: hashedPassword,
                      displayName: req.body.displayName};
    u.register(ourContent, function (err, data) {
        if (err) {
            //should improve error cases
            res.status(500).json({result: 'error', reason:'The call to user.register failed.  Here is the reason: ' + err.error});
        } else {
            req.session.userID = data;
            res.json({result:'ok'});
        }
    });
};

exports.logout = function (req, res) {
    res.clearCookie('app.sess');
    res.redirect('/login');
};

exports.updateUser = function (req) {
    var update = {userID: req.session.userID,
              name: req.data.name,
              email: req.data.email,
              mobile: req.data.mobile};
    
    u.update(update, function (err, data) {
        if (err) {
            req.io.emit('updateUserFailure', err);
        } else {
            req.io.emit('updateUserSuccess', data);
        }
    });
    
};
    
exports.changePassword = function (req) {
    if (req.data.oldpassword && req.data.newpassword) {
        var oldHash = hashPwd(req.data.oldpassword),
            newHash = hashPwd(req.data.newpassword),
            verify = {userID: req.session.userID, password: oldHash};
        
        u.verifyPassword(verify, function (err, data) {
            if (err) {
                req.io.emit('changePasswordError', err);
            } else if (!data) {
                req.io.emit('changePasswordNoMatch', undefined);
            } else {
                verify.password = newHash;
                u.update(verify, function (err, data) {
                    if (err) {
                        req.io.emit('changePasswordError', err);
                    } else {
                        req.io.emit('changePasswordSuccess', err);
                    }
                });
            }
        });
    } else {
        req.io.emit('changePasswordError', {error: 'Missing data in reqest'});
    }
};