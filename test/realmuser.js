console.log('realmuser');
var expect = require("chai").expect;
var realmUser = require('d4-realmuser');
var user = require('d4-user');
var node = require('d4-realmnode');

var rockID, nodeID;

before(function(done){
    user.userModel.findOne({email:'rockuser@email.com'}, function (err, data) {
        if (err)
            throw "Couldn't find rock user";
        else
            rockID = data._id;

        node.model.create({owner:rockID}, function(err,data){
            if (err)
                throw "Failure to create node";
            else {
                nodeID = data._id;
            }
            
            done();
        });      
    });
    

});

after(function(){
    node.model.remove({owner:rockID}, function(err, data){
        realmUser.model.remove({user: rockID}, function (err, data){
            done();
        });
    });
});

describe('d4-realmuser', function(){
    describe('joinGame', function(){
        it('should throw an error for a blank user', function(done){
            realmUser.joinGame({userid:null}, function(err, data){             
                expect(err).to.be.ok;
                expect(data).to.not.be.ok;
                done();
            });
        });        
        it('should add the user to the game', function(done){
            realmUser.joinGame({userid:rockID}, function(err, data){    
                expect(err).to.not.be.ok;
                expect(data).to.be.ok;
                done();
            });
        });
    });  
    
    describe('getUserView', function(){
        it('should throw an error for a blank user', function(done){
            realmUser.getUserView({userid:null}, function(err, data){
                expect(err).to.be.ok;
                expect(data).to.not.be.ok;
                done();
            });
        });        
        it('should get the user view', function(done){
            realmUser.getUserView({userid:rockID}, function(err, data){
                expect(err).to.not.be.ok;
                expect(data).to.be.ok;
                expect(data.userid).to.be.ok;
                done();
            });
        });
    });    
    
    describe ('setCurrentLoc/getCurrentLoc', function () {
        it('getCurrentLoc should return null', function (done) {
            realmUser.getCurrentLoc({userid:rockID}, function(err, data) {
                expect(err).to.not.be.ok;
                expect(data.currentLoc).to.be.undefined;
                done(); 
            });
        });
        
        it('should set a node', function (done) {
            realmUser.setCurrentLoc({userid: rockID, nodeID: nodeID}, function (err, data) {
                expect(err).to.not.be.ok;
                expect(data).to.be.ok;
                done(); 
            });
        });
        
        it('should get a node', function (done) {
            realmUser.getCurrentLoc({userid: rockID}, function (err, data) {
                expect(err).to.not.be.ok;
                expect(data.currentLoc._id).to.eql(nodeID);
                done(); 
            });
        });        
    });    
});