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
	const userId = req.header('userId')
	User.findById({ _id: userId })
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
	if (!req.body.username || !req.body.password || !req.body.name) {
    res.json({success: false, msg: 'Please pass name, username,  and password.'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        console.log(err);
        return res.json({success: false, msg: 'Username already exists.'});

      }
      console.log('save success');
      res.json({success: true, msg: 'Successful created new user.'});

    });

  }
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
