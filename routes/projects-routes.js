var express = require('express');
var { check } = require('express-validator');  // Using object destructuring to just use the check method, not all the object properties and methods
var router = express.Router();

var projectsController = require('../controllers/projects-controllers');

router.get('/:pid', projectsController.getProjectById);

router.get('/user/:uid', projectsController.getProjectsByUserId);

router.post(
    '/', 
    [
    check('title')
      .isLength({min: 5}), 
    check('phase')
      .not()
      .isEmpty(),
    check('team')
      .not()
      .isEmpty()
    ],
    projectsController.addProject);

router.patch('/:pid', projectsController.updateProject);

router.delete("/:pid", projectsController.deleteProject);

module.exports = router;