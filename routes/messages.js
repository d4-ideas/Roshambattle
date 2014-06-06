exports.taunt = function(req){
	req.io.broadcast("messageForYouSir", { "who" : req.session.displayName, "what" : req.data.taunt});
}