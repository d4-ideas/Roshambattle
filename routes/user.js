var u = require('d4-user');


var hashPwd = function (password) {
    var crypto = require('crypto'),
        shaSum = crypto.createHash('md5'),
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
    console.log('call register');

    u.register(ourContent, function(err, data){
        if (err){
            //should improve error cases
            res.status(500).json({result:'error', reason:'The call to user.register failed.  Here is the reason: ' + err.error});
        } else {
            req.session.userID = data;
            res.json({result:'ok'});
        }
    });
};

exports.getUserScore = function(req){
    user.getRoshamUser(req.session.userID, function(err, data){
        if(data)
            req.io.emit('UserScoreSuccess',data);
        else
            req.io.emit('UserScoreFailure',err);
    });    
};



exports.getTurns = function(req){
    turn.getTurns({userID:req.session.userID}, function(err, data){
        if(err)
            req.io.emit('getTurnsFailure', 'Failed to get the turns for you: ' +  err.error);
        else{
            var num = data.length,
                i = 0,
                turns = new Array();
            turns.length = num;
            data.forEach(function(element){
                turns[element.turnDate]='';
                result.getUserTurnResults ({turnDate:element.turnDate, userID:req.session.userID}, function(err, data) {
                    if (err)
                        req.io.emit('getTurnsFailure', 'Failed to get the results for you: ' +  err.error);
                    else {
                        turns[i++] = data;
                        if (--num === 0) {
                            turns.sort(function(a,b){
                                var date1 = new Date(a.turnDate),
                                    date2 = new Date(b.turnDate);
                                return date2-date1;
                            }); 
                            req.io.emit('getTurns', turns);
                        }
                    }
                }); 
        
            });
            
        }
    });
};

exports.logout = function (req, res) {
    res.clearCookie('app.sess');
    res.redirect('/login');
};

exports.updateUser = function (req){
    console.log(req.data);

    var update = {userID: req.session.userID,
              name: req.data.name,
              email: req.data.email,
              mobile: req.data.mobile};  
    
    u.update(update, function(err, data){
        if (err) {
console.log('err');
console.log(err);
            req.io.emit('updateUserFailure', err)
        }
        else {
console.log('success');
console.log(data);
            req.io.emit('updateUserSuccess', data);
        }
   });
    
};
    
exports.changePassword = function (req) {
console.log(req.data);     
    if (req.data.oldpassword && req.data.newpassword){
        var oldHash = hashPwd(req.data.oldpassword),
            newHash = hashPwd(req.data.newpassword);
        var verify = {userID: req.session.userID,
                      password: oldHash};
        
        u.verifyPassword (verify, function (err, data) {
            if (err){
                req.io.emit('changePasswordError', err);   
            }
            else if (!data){
                req.io.emit('changePasswordNoMatch', undefined);
            }
            else {
                verify.password = newHash;
                u.update (verify, function (err, data) {
                    if (err) {
                        req.io.emit('changePasswordError', err);  
                    }
                    else {
                        req.io.emit('changePasswordSuccess', err);  
                    }
                });
            }
        });
    }  
    else {
        req.io.emit('changePasswordError', {error: 'Missing data in reqest'});  
    }
};