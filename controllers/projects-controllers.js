var mongoose = require("mongoose");
var uuid = require("uuid/v4");
var { validationResult } = require("express-validator");

var HttpError = require("../models/http-errors");
var Project = require("../models/project");
var User = require("../models/user");



var getProjectById = async function (req, res, next) {
    var userId = req.params.uid;

    let project;
    try {
        project = await Project.findById(userId);
    } catch (err) {
        let error = new HttpError(
            "Could not complete getting this project", 500
        );
        return next(error);
    }

    if (!project) {
        var error = new HttpError("No projects with that ID", 404);

    return next(error);
}
    res.json({project: project.toObject({ getters: true }) });
};


var getProjectsByUserId = async function(req, res, next) {
    var userId = req.params.uid

    // let projects;
    let userWithProjects;

    try {
        userWithProjects = await User.findById(userId).populate("projects")
    } catch (err) {
        var error = new HttpError(
            "Fetching failed, please try later.", 500
        );
        return next(error);
    }

    if (!userWithProjects || userWithProjects.projects.length === 0) {
        return next(
            new HttpError("No projects found for that user ID", 404)
        );
    }
    res.json({ 
        projects: userWithProjects.projects.map(project => project.toObject({ getters: true}))});
};


var addProject = async function (req, res, next) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        new HttpError("Invalid inputs passed, please check your entries.", 422);
    }

    var { title, description, lead, creator } = req.body;
    
    var addedProject = new Project({
        title,
        description,
        lead, 
        creator
    });

    let user;

    try {
        user = await User.findById(creator)
    } catch (err) {
        var error = new HttpError("Could not complete project creation, please try again.", 500
        );
        return next(error);
    }

    if (!user) {
        var error = new HttpError("Could not find user with provided id.", 404);
        return next (error);
    }

    console.log(user);

    try {
        let sessionCurrent = await mongoose.startSession();
        sessionCurrent.startTransaction();
        await addedProject.save({ session: sessionCurrent });
        user.projects.push(addedProject);  // Establishing connection between the user and project models
        await user.save({ session: sessionCurrent });
        await sessionCurrent.commitTransaction();
    } catch(err) {
        var error = new HttpError(
            'Could not complete adding a project, please try again.', 500
        );
        return next(error);
    };
    
    res.status(201).json({projects: addedProject});
};


var updateProject = async function (req, res, next) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
             new HttpError("Invalid inputs, please update and try again", 422)
        );
    }

    const { lead, description } = req.body
    const projectId = req.params.pid;

    let project;
    try  {
        project = await Project.findById(projectId);
    } catch (err) {
      let error = new HttpError(
        "Something has gone wrong.", 500
    );
    return next(error);
    }

    project.lead = lead;
    project.description = description;

    try {
        await project.save();
    } catch (err) {
        let error = new HttpError(
            "Something has gone wrong, project was not updated.", 500
        );
        return next(error);
    }

    res.status(200).json({ project: project.toObject({ getters: true }) });
};


var deleteProject = async function (req, res, next) {
    var projectId = req.params.pid;

    let project;

    try {
        project = await Project.findById(projectId).populate("creator");
    } catch (err) {
        let error = new HttpError(
            "An error occured, place could not be deleted.", 500
        );
        return next(error);
    }

    if (!project) {
        let error = new HttpError("Could not find the project id.", 404);
        return next(error);
    }

    try { 
      var sessionCurrent = await mongoose.startSession();
      sessionCurrent.startTransaction();
      await project.remove({ seesion: sessionCurrent });
      project.creator.projects.pull(project);
      await project.creator.save({ session: sessionCurrent });
      await sessionCurrent.commitTransaction();
    } catch (err) {
        let error = new HttpError(
            "An error has occured.", 500
        );
        return next(error);    
    }

    res.status(200).json({ message: "Project deleted" });
}


exports.getProjectById = getProjectById;
exports.getProjectsByUserId = getProjectsByUserId;
exports.addProject = addProject;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;