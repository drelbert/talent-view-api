var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true},
    password: { type: String, required: true, minlength: 6 },
    projects: [{ type: mongoose.Types.ObjectId, required: true, ref: "Project" }]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);