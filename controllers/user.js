// Import User model
let User = require('../models/user');

// Retrieve a list of all users (optionally filter by url params)
exports.list = (req, res) => {
	const query = req.query || {};
	User.apiQuery(query)
		// limit the information returned (server side) – e.g. no password
		.select('name email username admin')
		.then(users => {
			res.json(users);
		})
		.catch(err => {
			res.status(422).send(err.errors);
		});
};

// Get a single user by ID provided in URL param
exports.get = (req, res) => {
	User.findById({ _id: req.params.userId })
		.then(user => {
			user.password = undefined;
			user.recoveryCode = undefined;

			res.json(user);
		})
		.catch(err => {
			res.status(422).send(err.errors);
		});
};

// Update a specific user
exports.put = (req, res) => {
	const data = req.body.data
	console.log(req.user._id + ' trying to update user:' + data._id)
	if ((req.user.admin === true) | ((req.user._id).toString() === data._id)){ //Admin check works, todo: check for role/memberships in the future
		User.findByIdAndUpdate({ _id: data._id }, {name: data.name, username: data.username}, { new: true })
			.then(user => {
				if (!user) {
					return res.sendStatus(404);
				}
				user.password = undefined;
				user.recoveryCode = undefined;
				res.json(user);
			})
			.catch(err => {
				res.status(422).send(err.errors);
			});
	} else {
		res.status(401).send({'message':'You do not have permission to complete this action'})
	}
};

// Create a new user
exports.post = (req, res) => {
	const data = Object.assign({}, req.body, { user: req.user.sub }) || {};

	User.create(data)
		.then(user => {
			res.json(user);
		})
		.catch(err => {
			res.status(500).send(err);
		});
};


// Remove a user record TODO: set 'active' flag rather than actually delete the user object.
exports.delete = (req, res) => {
	if ((req.user.admin === true) | ((req.user._id).toString() === data._id)){ //Admin check works, todo: check for role/memberships in the future
		User.findByIdAndRemove(
			{ _id: req.body._id }
		)
			.then(user => {
				if (!user) {
					return res.sendStatus(404);
				}
				res.sendStatus(204);
			})
			.catch(err => {
				res.status(422).send(err.errors);
			});
	} else {
		res.status(401).send({'message':'You do not have permission to complete this action'})
	}
};
