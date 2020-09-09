var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var projectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    lead: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User"}
});

module.exports = mongoose.model("Project", projectSchema);