var node = require('d4-realmnode');
var conn = require('d4-realmconnection');

exports.createConnection = function(req){
//    {connection:{node12:$('#node12').val(),        
//                                      node12Desc:$('#node12Desc').val(), 
//                                      node21:$('#node21').val(),
//                                      node21:$('#node21Desc').val()
//                                     }, 
//                          node:{shortDesc:$('#shortDesc').val(),
//                                description:$('#description').val()
//                            };
//    
    var connection = {};
    connection.node12Desc = req.data.connection.node12Desc;
    if (req.data.connection.node1 == 'Lobby')
        connection.node1 = node.lobbyID;
    else
        connection.node1 = req.data.connection.node1;
    connection.node21Desc = req.data.connection.node21Desc;

    if (req.data.connection.node2 == '(new)'){     
        //create the new node and wait for the _id back
        var newNode = {};
        newNode.user = req.session.userID;
        newNode.shortDesc = req.data.node.shortDesc;
        newNode.description = req.data.node.description;
        
        node.addNode(newNode, function(err, data){
            if (err)
                req.io.emit('createConnectionFailure', {error:err});
            else{
                connection.node2 = data._id;
                conn.addConnection(connection, function(err, connData){
                    if (err){
                        console.log(err);
                        req.io.emit('createConnectionFailure', {error:err});
                    }
                    else{
                        var retVal = {};
                        retVal.node = data;
                        retVal.connection = connData;                       
                        req.io.emit('createConnectionSuccess', retVal);
                    }
                });
            }
        });
    } else{              
        //create the connection only
        connection.node2 = req.data.connection.node2;
        conn.addConnection(connection, function(err, connData){
            if (err){
                console.log(err);
                req.io.emit('createConnectionFailure', {error:err});
            }
            else{
                var retVal = {connection:connData};
                req.io.emit('createConnectionSuccess', retVal);
            }
        });
    }
    

}

exports.getNodes = function(req){
    node.getNodes(req.session.userID, function(err, data){
        if (err)
            req.io.emit('getNodesFailure', {error:err});
        else{
            var nodeIDs = data.map(function(node){
                return node._id;
            });

            //inintialize To and From objects onto the nodes
            nodes = data.map(function(node){
                var modnode = {};
                modnode.node = node;
                modnode.to = new Array();
                modnode.from = new Array();
console.log(modnode);
                return modnode;
            });             
            conn.getConnections({nodes:nodeIDs}, function(err, conns){
               if (err)
                   callback({error:err}, undefined);
                else {
console.log(conns);
                    conns.forEach(function(conn){
                        nodes.forEach(function(node) {             
                            if (conn.node1._id.equals(node.node._id)){
                                node.to = node.to.concat(conn.node2);
console.log('concatTo');
                            }
                            if (conn.node2._id.equals(node.node._id)){
                                node.from = node.from.concat(conn.node1);                               
console.log('concatFrom');
                            }
                        });
                    });
console.log(nodes);                        
                    req.io.emit('getNodesSuccess', nodes);
                }
            });
        }
    });    
}