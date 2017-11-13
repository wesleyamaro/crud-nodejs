const templates = __dirname + '/../../src/views/';
const User      = require(__dirname + '/../../models/user');

module.exports = {
    view: function(req, res){
   		User.find({}, function(err, users) {
		    let userMap = {};

		    users.forEach(function(user) {
	      		userMap[user._id] = user;
		    });

		    res.render(templates + 'list', {
				title: 'List - MyProject',
				users: userMap
			});
	  	});
    }
}
