var ruser = require('d4-roshamuser');
var turn = require('d4-roshamturn');
var d4sockets = require('d4-sockets');
var leaderBoard = require('d4-roshamleader');


exports.selectWeapon = function (req,res){
    if (req.data.weapon){
		ruser.setWeapon({'userid':req.session.userID, 'weapon':req.data.weapon}, function(err, success){
			if(err){
				req.io.emit('selectWeaponFailure', {reason:'Bzzz...  try again.  The call to setWeapon failed with reason: '+err.error});
			} 
			else {
				req.io.emit('selectWeaponSuccess',{'result':'ok'});
			}
		});
	} else {
            req.io.emit('selectWeaponFailure', {reason:'Arm yourself'});
    }
};

exports.generateTurn = function (req,res){
    turn.generateTurn(function(err, data){
        if (data){
            d4sockets.contactConnectedSockets(data);
            leaderBoard.genScores();
            res.render('generateTurn', { title: 'RoshamBattle!', status: 'ok'});
        } else {
            res.render('generateTurn', { title: 'RoshamBattle!', status: 'you failed.' + err.error});
        }
    });    
};