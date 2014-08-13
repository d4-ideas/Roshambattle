var node = require('d4-realmnode');

exports.createNode = function(req){
    node.addNode({user:req.session.userID}, function(err, data){
        if (err)
            req.io.emit('createNodeFailure', {error:err});
        else
            req.io.emit('createNodeSuccess', data);
    });
}