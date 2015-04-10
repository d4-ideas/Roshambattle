var user = require('d4-user'),
    nodemailer = require("nodemailer"),
    sendmailTransport = require('nodemailer-sendmail-transport');

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
                token = uuid.v4(),
                messageText = "Please visit http://d4-ideas.com/remember?token=" + token + " to reset your password.";
                mailOptions = {
                    from: "The FSM <fsm@d4-ideas.com>", // sender address.
                    to: req.body.emailAddress, // receiver
                    subject: "d4-ideas Password Reset <DO NOT REPLY>", // subject
                    text: messageText // body
            };
            theUser.token = token;
            user.update(theUser, function(){
                console.log(mailOptions);
                transporter.sendMail(mailOptions, function(error, response){  //callback
                    console.log("in transporter");
                    if (error) {
                       console.log(error);
                    }
                    else {
                        console.log("Message sent: ");
                        console.log(response);
                        res.json({result: 'ok'});
                   }

                   transporter.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
                });

            })
        }
    });
};

exports.rememberPasswordGet = function (req, res) {
    res.render('rememberPassword', { title: 'Remember Password' });
}

exports.rememberPasswordPost = function (req, res) {
    user.getUser({email: req.body.emailAddress.toLowerCase()}, function(err, data){
        if (err) {
            console.log('someone wants to reset ' + req.body.emailAddress + ', but we did not find it in the database');
            console.log(err);
            res.status(500).json({result:'error', reason: 'No Such Address'});
        }
        else {
            var transporter = nodemailer.createTransport(sendmailTransport()),
                mailOptions= {
                    from: "The FSM <fsm@d4-ideas.com>", // sender address.
                    to: req.body.emailAddress, // receiver
                    subject: "d4-ideas Password Reset <DO NOT REPLY>", // subject
                    text: "We Got This Far" // body
            };

            console.log('password reset ready');
        //    transporter.sendMail(mailOptions, function(error, response){  //callback
        //       if (error) {
        //           console.log(error);
        //       } else {
        //           console.log("Message sent: ");
        //           console.log(response);
        //       }
        //
        //       transporter.close(); // shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
        //    });

            res.json({result: 'ok'});
        }
    });
};