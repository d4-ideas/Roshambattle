var u = require('d4-user');
var user = require('d4-roshamuser');
var turn = require('d4-roshamturn');
var result = require('d4-roshamresult');

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

//exports.lowerEmails = function(req, res) {
//    u.userModel.find({}, function(err, docs){
//        var i = 0;
//        docs.forEach(function(doc){
//            doc.email = doc.email.toLowerCase();
//            doc.save();
//            i++
//        });
//        res.render('generateTurn', {title: 'lowerEmails!', status:'docs updated-'+i + '' + docs});
//    });
//}