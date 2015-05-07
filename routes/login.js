var user = require('d4-user'),
    nodemailer = require("nodemailer"),
    sendmailTransport = require('nodemailer-sendmail-transport'),
    hashPwd = function (password) {
        var crypto = require('crypto'),
            shaSum = crypto.createHash('md5');
        password = password + 'd4bacon';

        shaSum.update(password);
        return shaSum.digest('hex');
    },
    // single function to check if the user supplied good info for a password reset
    badResetItems = function(checkO, userO, callback){
        if (typeof userO === 'undefined'){
            callback("We'll need the correct email and token, por favor.");
        }
        //good token
        else if (checkO.token === userO.token.tokenKey){
            if (checkO.email === userO.email) {
                callback(false);
            }
            else {
                callback("Sorry, that token and email do not match.");
            }
        }
        //got a bad token
        else {
            callback("Sorry, that token and email do not match.");
        }
    };

exports.loginGet = function (req, res) {
    //Should we check session state and pass through if the user already has a valid session?
    //console.log('get login');
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

exports.forgotPasswordGet = function (req, res) {
    res.render('forgotPassword', { title: 'Forgot Password', error: '' });
}

exports.forgotPasswordPost = function (req, res) {
    var uuid = require('node-uuid');
    user.getUser({email: req.body.emailAddress.toLowerCase()}, function(err, foundUser){
        if (err) {
            console.log('someone wants to reset ' + req.body.emailAddress + ', but we did not find it in the database');
            console.log(err);
            res.status(500).json({result:'error', reason: 'No Such Address'});
        }
        else {
            var transporter = nodemailer.createTransport(sendmailTransport()),
                tokenKey = uuid.v4(),
                messageText = "Please visit http://d4-ideas.com/rememberPassword?tokenKey=" + tokenKey + "&email=" + req.body.emailAddress + " to reset your password.";
                mailOptions = {
                    from: "The FSM <fsm@d4-ideas.com>", // sender address.
                    to: req.body.emailAddress, // receiver
                    subject: "d4-ideas Password Reset <DO NOT REPLY>", // subject
                    text: messageText // body
            };
            foundUser.token = {tokenDate: Date.now(), tokenKey: tokenKey};
            user.update(foundUser, function(err, data){
                if (err){
                    console.log('shit hitting fan');
                    console.log(err);
                }
                else {
                    transporter.sendMail(mailOptions, function(err, response){  //callback
                        console.log("in transporter");
                        if (err) {
                           console.log(err);
                        }
                        else {
                            console.log("Message sent: ");
                            console.log(mailOptions);
                            console.log(response);
                            res.json({result: 'ok'});
                       }

                       transporter.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                    });
                }
            })
        }
    });
};

exports.rememberPasswordGet = function (req, res) {
    var supplied = {token: req.query.tokenKey || '', email: req.query.email || ''},
        tokenKey,
        givenEmail;
    
    user.getUser({tokenKey: supplied.token}, function (err, foundUser){
        badResetItems(supplied, foundUser, function(errorMessage){
            if (errorMessage){
                console.log(errorMessage);
//                console.log('bad reset info');
                res.render('rememberPassword', {title: 'Remember Password', tokenKey: '', givenEmail: supplied.email, error: errorMessage});
            }
            else {
//                console.log('Woot! everything checks out for a password reset');
                res.render('rememberPassword', { title: 'Remember Password', tokenKey: supplied.token, givenEmail: supplied.email, error: ''});
            }
        });
    });
}

exports.rememberPasswordPost = function (req, res) {
    var supplied = {token: req.body.tokenKey || '', email: req.body.email || ''},
        tokenKey,
        givenEmail;
    
    user.getUser({tokenKey: supplied.token}, function (err, foundUser){
        if (typeof err !== 'undefined'){
            console.log(err);
            res.status(500).json({result:'error', reason: 'That email and token do not match.'});
        }
        else {
            badResetItems(supplied, foundUser, function(errorMessage){
                if (errorMessage){
//                    console.log(errorMessage);
                    res.status(500).json({result:'error', reason: errorMessage});
                }
                else {
                    user.update(foundUser, function(error, data){
                        if (err){
                            console.log('Something went wrong resetting a password');
                            console.log(err);
                            res.status(500).json({result:'error', reason: 'Yeah, something went wrong'});
                        }
                        else {
                            console.log('woot! Passord reset!');
                            res.json({result: 'ok'});
                        };
                    });
                }
            });
        };
    });
};