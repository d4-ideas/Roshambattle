var node = require('d4-realmnode');
var conn = require('d4-realmconnection');
var user = require('d4-realmuser');

//************************************************************************************************************
// function     : realmExplore.navToLoc
// developer    : Rob
// arguments    : nodeID - the location we are navigating to.  If this is null, the current location of the user or the lobby (if not current location) will be returned.
//***************************************************************************************
exports.navToLoc = function (req) {
    console.log(req);
    if (typeof req.data.nodeID === 'undefined' || req.data.nodeID === null) {
        user.getCurrentLoc({userid: req.session.userID}, function (err, data) {
            console.log(err);
            console.log(data);
            if (err || !data.currentLoc) {
                getNode(node.lobbyID, req);
            } else {
                getNode(data.currentLoc._id, req);
            }
        });
    } else {
        getNode(req.data.nodeID, req);
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
                    var node = {};
                    node.node = data[0];
                    node.from = new Array();
                    node.to = new Array();

                    conns.forEach(function (conn) {
                        if (conn.node1._id.equals(node.node._id)) {
                            node.to = node.to.concat({shortDesc: conn.desc12, node: conn.node2});
                        } else {
                            node.from = node.from.concat({shortDesc: conn.desc21, node: conn.node1});
                        }
                    });
                    
                    user.setCurrentLoc({userid: req.session.userID, nodeID: nodeID}, function (err, data) {});
                    req.io.emit('navToLocSuccess', node);
                }
            });
        }
    });
};