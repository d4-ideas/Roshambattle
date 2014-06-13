console.log('roshamresults');
var expect = require("chai").expect;
var ruser = require('d4-roshamuser');
var user = require('d4-user');
var testResult = require('d4-roshamresult');



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
            testResult.getUserTurnResults({turnDate:turnDate, userID:''}, function(err, data) {
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                expect(data.weapon).to.be.string('Rock');
            });
        });
    });
});
