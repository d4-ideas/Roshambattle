var node = require('d4-realmnode');
var conn = require('d4-realmconnection');

exports.createNode = function(req){
    node.addNode({user:req.session.userID, shortDesc:req.data.shortDesc, description: req.data.description}, function(err, data){
        if (err)
            req.io.emit('createNodeFailure', {error:err});
        else{
            conn.addConnection({node1: node.lobbyID, node2: data._id}, function(err, connData){
                if (err){
                    console.log(err);
                    req.io.emit('createNodeFailure', {error:err});
                }
                else
                    req.io.emit('createNodeSuccess', data);
            });
        }
    });
}

exports.getNodes = function(req){
    node.getNodes(req.session.userID, function(err, data){
        if (err)
            req.io.emit('getNodesFailure', {error:err});
        else
            req.io.emit('getNodesSuccess', data);
    });    
}