import User from '../../models/user';

const templates = __dirname + '/../../src/views/';

export const listCtrl = {
    view: function(req, res){
		User.find({}, function(err, users) {
			let userMap = {};

			if(users.length) {
				users.forEach(function(user) {
					userMap[user._id] = user;
				});
			}

			res.render(templates + 'list', {
				title: 'List - MyProject',
				users: userMap
			});
		});
    }
}
