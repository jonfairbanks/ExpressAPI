// Import User model
let User = require('../models/user');

// Retrieve a list of all users (optionally filter by url params)
exports.list = (req, res) => {
	const query = req.query || {};
	User.apiQuery(query)
	// Limit the information returned (server side) – e.g. no password
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
};
