console.log('roshamturn');
var expect = require("chai").expect;
var ruser = require('d4-roshamuser');
var user = require('d4-user');
var testTurn = require('d4-roshamturn');
var rockID;

before(function(){
    user.userModel.findOne({email:'rockuser@email.com'}, function (err, data) {
        if (err)
            throw "Couldn't find rock user";
        else
            rockID = data._id;
    });
});

describe('d4-roshamturn', function() {
    describe('.generateTurn', function() {
        it('should create a new turn', function(done){
            testTurn.generateTurn(function(err, data){
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                ruser.getRoshamUser(rockID, function(err, data){
                    expect(data).to.be.ok;
                    done();
                });
            });
        });
    });
    
    describe('.getTurns', function() {
        it('should return an error', function(done){
            testTurn.getTurns(undefined, 
                              function(err,data){
                expect(err).to.be.ok;
                expect(data).to.be.undefined;
                done();
            });
        });
        
        it('should return an array of turns', function(done){
            testTurn.getTurns({startDate:'5/22/2014',
                               numberOfTurns:2,
                               userID:undefined}, 
                              function(err,data){
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                expect(data).to.be.an('array');
                expect(data).to.have.length(2);
                done();
            });
        });
        it('should return an array of turns with no start date ', function(done){
            testTurn.getTurns({numberOfTurns:2,
                               userID:rockID}, 
                              function(err,data){
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                expect(data).to.be.an('array');
                expect(data).to.have.length(2);
                done();
            });
        });        
        it('should return an empty array of turns', function(done){
            var startDate = new Date("October 13, 1975 11:13:00");
            testTurn.getTurns({startDate:startDate,
                               numberOfTurns:5,
                               userID:undefined}, 
                              function(err,data){
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                expect(data).to.be.an('array');
                expect(data).to.have.length.below(1);
                done();
            });
        });        
    });    
});