// Create endpoint /api/v1/test for GET
exports.getHello = function(req, res) {
	if (!req.user) {
	  return res.status(403).send({success: false, msg: 'I do not know whom to great!'});
	} else {
	  res.json({success: true, msg: 'Hello ' + req.user.username + '!'});
	}
};

