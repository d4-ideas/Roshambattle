var node = require('d4-realmnode');
var conn = require('d4-realmconnection');
var user = require('d4-realmuser');
var exLog = require('d4-realmexplorelog');

//************************************************************************************************************
// function     : realmExplore.navToLoc
// developer    : Rob
// arguments    : nodeID - the location we are navigating to.  If this is null, the current location of the user or the lobby (if not current location) will be returned.
//***************************************************************************************
exports.navToLoc = function (req) {
    var conn = req.data.conn,
        destNode = req.data.destNode,
        destNodeID;
    
    if (typeof conn === 'undefined' || conn === null) {
        user.getCurrentLoc({userid: req.session.userID}, function (err, data) {;
            if (err || !data.currentLoc) {
                getNode(node.lobbyID, req);
            } else {
                getNode(data.currentLoc._id, req);
            }
        });
    } else { 
        
        destNodeID = (destNode === 1)?conn.node1._id:conn.node2._id;
        getNode(destNodeID, req);
        exLog.addLog ({userID: req.session.userID,
                       connUsed: conn,
                       destNode: destNode}, function(err,data){});
    }
};

var getNode = function (nodeID, req) {
    node.getNode({nodeID: nodeID}, function (err, data) {
        if (err) {
            req.io.emit('navToLocFailure', err);
        } else {
            conn.getConnections({nodes: [nodeID]}, function (err, conns) {
                if (err) {
                    req.io.emit('navToLocFailure', err);
                } else {
                    var loc = {};
                    loc.node = data[0];
                    loc.conns = conns;

                    if (!loc.node._id.equals(node.lobbyID)){

                        var lobbyConn = {desc12: '',
                                       node1: {"_id": node.lobbyID},
                                       desc21: 'Teleport to Lobby',
                                       node2: loc.node}; 
                        loc.conns.push(lobbyConn);
                    }
                    
                    user.setCurrentLoc({userid: req.session.userID, nodeID: nodeID}, function (err, data) {});
                    req.io.emit('navToLocSuccess', loc);
                }
            });
        }
    });
};