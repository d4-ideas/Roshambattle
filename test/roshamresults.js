console.log('roshamresults');
var expect = require("chai").expect;
var ruser = require('d4-roshamuser');
var user = require('d4-user');
var testResult = require('d4-roshamresult');
var rockID;

before(function(){
    user.userModel.findOne({email:'RockUser@email.com'}, function (err, data) {
        if (err)
            throw "Couldn't find rock user";
        else
            rockID = data._id;
    });
});



describe('d4-roshamresult', function() {
    describe('.getTurnResults', function() {
        it('should return the results', function(done){
            var turnDate = Date.now();
            testResult.getTurnResults({turnDate:turnDate}, 
                               function(err,data){
                console.log(data);                    
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                done();
            });            
        });        
    });    
    
    describe('.getUserTurnResults', function() {
        it('should return the results', function(done){
            var turnDate = Date.now();
            testResult.getUserTurnResults({turnDate:turnDate, userID:rockID}, function(err, data) {
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                expect(data.weapon).to.be.string('Rock');
            });
        });
    });
});
