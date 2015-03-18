console.log('realmexplorelog');
var expect = require("chai").expect;
var exLog = require('d4-realmexplorelog');
var user = require('d4-user');
var rockID;

before(function(done){
    user.userModel.findOne({email:'rockuser@email.com'}, function (err, data) {
        if (err)
            throw "Couldn't find rock user";
        else
            rockID = data._id;
        done();
    });
});

after(function(){
    exLog.model.remove({userID:rockID}, function(err, data){
        if (err || data < 1)
            throw 'unable to cleanup logs';
    });
});

describe('d4-realmexplorelog', function(){
    describe('addLog', function(){
        it('should create a log', function(done){
            var logItem = {userID: rockID, 
                          connUsed: {node12: 'test'},
                          destNode: 1};
            exLog.addLog(logItem, function (err, data){
                expect(err).to.be.not.ok;
                expect(data).to.be.ok;
                done();
            });
        });
    });
    
    describe('getLogbyUser', function(){
        it('should get the user log', function(done){
            exLog.getLogbyUser({userID: rockID
                               , limit: 2
                               , sort: '-createdDate'}, function (err, data){
                expect(err).to.be.not.ok;
                expect(data).to.be.ok;
console.log(data);                
                done();
            });
        });
    });    
});