var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var projectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    phase: { type: String, required: true },
    dueDate: { type: Date, required: true },
    lead: { type: mongoose.Types.ObjectId, required: true, ref: "User"},
    team: String,
    updateNotes: String
});

module.exports = mongoose.model("Project", projectSchema);