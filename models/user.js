let mongoose = require('mongoose')
let timestamps = require('mongoose-timestamp');
let mongooseStringQuery = require('mongoose-string-query');
let bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  google: Object,
  photo: String,
  admin: Boolean,
  username: {
      type: String,
      unique: true,
      required: true
  },
  password: {
      type: String,
      required: true
  }
});

// Encrypt the password before storing.
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

// Verify password by decrypting it.
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

// Configure plugins
UserSchema.plugin(timestamps); // automatically adds createdAt and updatedAt timestamps
UserSchema.plugin(mongooseStringQuery); // enables query capabilities (e.g. ?foo=bar)

module.exports = mongoose.model('User', UserSchema)
