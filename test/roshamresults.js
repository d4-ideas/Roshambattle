console.log('roshamresults');
var expect = require("chai").expect;
var ruser = require('d4-roshamuser');
var user = require('d4-user');
var testResult = require('d4-roshamresult');

describe('d4-roshamresult', function() {
    describe('.getTurnResults', function() {
        it('should return the results', function(done){
            var turnDate = someTurns[0].turnDate;
            testResult.getTurnResults({turnDate:turnDate}, 
                               function(err,data){
                console.log(data);                    
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                done();
            });            
        });        
    });    
});
