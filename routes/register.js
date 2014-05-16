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
    user.register(ourContent);
        /*
        ourPost = http.request(options, function (returnRes) {
            returnRes.setEncoding('utf8');

            returnRes.on('data', function (chunk) {
                if (typeof returnData !== 'undefined') {
                    returnData += chunk;
                } else {
                    returnData = chunk;
                }
            });
            returnRes.on('end', function () {
                returnData = JSON.parse(returnData);
                if (typeof returnData.error !== 'undefined') {
                    res.json({status: 'error', 'reason': returnData.error});
                } else {
                    req.session.userID = returnData.userID;
                    //return success to the client
                    res.json({status: 'approved'});
                }
            });
        });
        */
    
    ourPost.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        res.json({status: 'error' + e.message});
    });

    // write data to request body
    ourPost.write(ourContent);
    ourPost.end();
};