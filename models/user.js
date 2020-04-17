var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: String,
    crew: String,
    projects: [{ type: mongoose.Types.ObjectId, required: true, ref: "Projects" }]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);