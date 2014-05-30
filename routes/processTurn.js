var ruser = require('d4-roshamuser');
var turn = require('d4-roshamturn');

exports.selectWeapon = function (req,res){
	console.log(req.body);
           ruser.setWeapon({'userid':req.session.userID, 'weapon':req.body.weapon}, function(err, success){
                if(err){
                    res.status(500).json({result:'error', reason:'Bzzz...  try again.  The call to setWeapon failed with reason: '+err.error});
                } 
                else {
                    res.json({result:'ok'});
                }
            });
	console.log(req.session);
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