var ruser = require('d4-roshamuser');
var turn = require('d4-roshamturn');

exports.selectWeapon = function (req){
	console.log(req.data);
    console.log(req.session);
   ruser.setWeapon({'userid':req.session.userID, 'weapon':req.data.weapon}, function(err, success){
		if(err){
			req.io.emit('result', {'result':'error', reason:'Bzzz...  try again.  The call to setWeapon failed with reason: '+err.error});
		} 
		else {
			req.io.emit('result',{'result':'ok'});
		}
	});
};

exports.generateTurn = function (req,res){
    turn.generateTurn(function(err, data){
        if (data){
            res.render('generateTurn', { title: 'RoshamBattle!', status: 'ok'});
        } else {
            res.render('generateTurn', { title: 'RoshamBattle!', status: 'you failed.' + err.error});
        }
    });    
};