console.log('roshamuser');
var expect = require("chai").expect;
var ruser = require('d4-roshamuser');
var user = require('d4-user');
var existingUser, 
    existingUserID;

before(function(done){
    existingUser = {emailAddress: 'rockuser@email.com',
                        password: 'testuser',
                        displayName: 'RockUser'}
    user.userModel.create(existingUser, function(err, noob){
        existingUserID = noob._id;
        done();
    });
});

describe('d4-roshamuser', function() {
    describe('.setWeapon()', function() {
        it('should log return success', function(done){   
           ruser.setWeapon({'userid':existingUserID, 'weapon':'Rock'}, function(err, success){
                if(err){
                    done(err);
                } 
                else {
                    done();
                }
            });
        });
    });
    describe('.getRoshamUser', function(){
        it('should return a roshamuser', function(done){
            ruser.getRoshamUser(existingUserID, function(err, data){
                expect(err).to.not.be.ok;
                expect(data).to.be.ok;
                done();
            });
        });
    });
});
