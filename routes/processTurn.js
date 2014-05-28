var ruser = require('d4-roshamuser');

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