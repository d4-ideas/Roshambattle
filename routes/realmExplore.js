var node = require('d4-realmnode');
var conn = require('d4-realmconnection');

exports.getNode = function(req){
    var nodeID;
 
    if (typeof req.data.nodeID === 'undefined' || req.data.nodeID === null) 
        nodeID = node.lobbyID;
    else
        nodeID = req.data.nodeID;

    node.getNode({nodeID:nodeID}, function (err, data) {
        if (err)
            req.io.emit('getNodeFailure', err);
        else {
            conn.getConnections({nodes:[nodeID]}, function(err, conns) {

                if (err)
                    req.io.emit('getNodeFailure', err);
                else{
                    var node = {};
                    node.node = data[0];
                    node.from = new Array();
                    node.to = new Array();

                    conns.forEach(function(conn){           
                        if (conn.node1._id.equals(node.node._id)){
                            node.to = node.to.concat({shortDesc: conn.desc12, node:conn.node2});
                        } else {
                            node.from = node.from.concat({shortDesc: conn.desc21, node:conn.node1});                               
                        }
                    });  

                    req.io.emit('getNodeSuccess', node);
                }
            });
        }
    });
}