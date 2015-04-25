var user = require('d4-user'),
    nodemailer = require("nodemailer"),
    sendmailTransport = require('nodemailer-sendmail-transport'),
    hashPwd = function (password) {
        var crypto = require('crypto'),
            shaSum = crypto.createHash('md5');
        password = password + 'd4bacon';

        shaSum.update(password);
        return shaSum.digest('hex');
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
    res.render('forgotPassword', { title: 'Forgot Password' });
}

exports.forgotPasswordPost = function (req, res) {
    var uuid = require('node-uuid');
    user.getUser({email: req.body.emailAddress.toLowerCase()}, function(err, theUser){
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
            theUser.token = {tokenDate: Date.now(), tokenKey: tokenKey};
            user.update(theUser, function(err, data){
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
//    console.log(req.query);
    var tokenKey = req.query.tokenKey,
        givenEmail = req.query.email;
//    console.log(tokenKey);
//    console.log(givenEmail);
    user.getUser({tokenKey: tokenKey}, function (err, foundUser){
//        console.log(foundUser);
        if (err || typeof tokenKey === 'undefined' || tokenKey ==='') {
            console.log('Someone is trying to reset a password with a bad tokenKey: ' + tokenKey);
            console.log(err);
            res.render('rememberPassword', {title: 'Remember Password', tokenKey: '', error: 'Sorry, can not find that tokenKey'});
        }
        else if (typeof givenEmail === 'undefined' || givenEmail === '') {
            console.log('Someone is trying to reset a password without giving us an email');
            res.render('rememberPassword', {title: 'Remember Password', tokenKey: '', error: 'Sorry, we need an email.'});
        }
        else if (foundUser.email !== givenEmail){
            console.log ('got a mismatch on user and token');
            console.log(tokenKey);
            console.log(givenEmail);
            res.render('rememberPassword', {title: 'Remember Password', tokenKey: '', error: 'email and token do not match'});
        }
        else {
            console.log('Woot! everything checks out for a password reset');
            res.render('rememberPassword', { title: 'Remember Password', tokenKey: tokenKey });
        }
    });
}

exports.rememberPasswordPost = function (req, res) {
//    console.log(req.body);
    var tokenKey = req.body.tokenKey;
    user.getUser({tokenKey: tokenKey}, function (err, theUser){
        if (err) {
            console.log('Something went wrong when trying to reset a password.');
            console.log(err);
            res.render('rememberPassword', {title: 'Remember Password', tokenKey: '', error: 'Sorry, can not find that tokenKey'});
        }
        else {
            theUser.token.tokenKey='';
            theUser.password=hashPwd(req.body.password);
            console.log(theUser);
            user.update(theUser, function(error, data){
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