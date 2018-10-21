// import user model
let User = require('../models/user');

// retrieve a list of all users
exports.list = (req, res) => {
	const query = req.query || {};
	User.apiQuery(query)
		// limit the information returned (server side) – e.g. no password
		.select('name email username bio url twitter background')
		.then(users => {
			res.json(users);
		})
		.catch(err => {
			res.status(422).send(err.errors);
		});

};

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

// update a specific user
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

// create a user
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


// remove a user record (in our case, set the active flag to false to preserve data)
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
