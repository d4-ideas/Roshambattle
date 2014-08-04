console.log('realmconnection');
var expect = require("chai").expect;
var conn = require('d4-realmconnection');
var node = require('d4-realmnode');
var user = require('d4-user');
var rockID, node1, node2;

before(function(done){
    user.userModel.findOne({email:'rockuser@email.com'}, function (err, data) {
        if (err)
            throw "Couldn't find rock user";
        else
            rockID = data._id;
        
            node.model.create({user:rockID}, {user:rockID}, function(err, nodeA, nodeB){
                node1 = nodeA;
                node2 = nodeB;
                done();
            })
    });
});

after(function(){
    conn.model.remove(null, function(err, data){
        if (err || data < 1)
            throw 'unable to cleanup connections';
    });
});

describe('d4-realmconnection', function(){
    describe('addConnection', function(){
        it('should create a connection', function(done){
            conn.addConnection({node1: node1, node2: node2}, function(err, data){
                expect(err).to.not.be.ok;
                expect(data).to.be.ok;
                done();
            });
        });
    });
});