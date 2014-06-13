console.log('roshamresults');
var expect = require("chai").expect;
var ruser = require('d4-roshamuser');
var user = require('d4-user');
var testResult = require('d4-roshamresult');
var rockID;
var paperID;

before(function(){
    user.userModel.findOne({email:'RockUser@email.com'}, function (err, data) {
        if (err)
            throw "Couldn't find rock user";
        else
            rockID = data._id;
            createResult();
    });
    user.userModel.findOne({email:'PaperUser@email.com'}, function (err, data) {
        if (err)
            throw "Couldn't find paper user";
        else
            paperID = data._id;
            createResult();
    });
    
    function createResult(){
        if((rockID != undefined)&&(paperID != undefined)){
            testResult.model.create({
                    'turnDate': '05/21/2014',
                    'player1': rockID, 
                    'weapon1': 'Rock',
                    'player2': paperID, 
                    'weapon2': 'Paper',
                    'winner': 2});
            
        }
    }
});



describe('d4-roshamresult', function() {
    describe('.getTurnResults', function() {
        it('should return the results', function(done){
            var turnDate = new Date('05/21/2014');
            testResult.getTurnResults({turnDate:turnDate}, 
                               function(err,data){
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                done();
            });            
        });        
    });    
    
    describe('.getUserTurnResults', function() {
        it('should return the results', function(done){
            var turnDate = new Date('05/21/2014');
            testResult.getUserTurnResults({turnDate:turnDate, userID:rockID}, function(err, data) {
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                expect(data.weapon).to.be.string('Rock');
            });
        });
    });
});
