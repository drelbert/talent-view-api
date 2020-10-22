var express = require("express");
// Using object destructuring to just use the checkAuth method, not all the object properties and methods
var { check } = require("express-validator");

var projectsController = require("../controllers/projects-controllers");
var checkAuth = require("../middleware/check-auth");

var router = express.Router();

// middleware
// order note, route order has to match controller order
router.get("/allProjects", projectsController.getAllProjects);

router.get("/:pid", projectsController.getProjectById);

router.get("/user/:uid", projectsController.getProjectsByUserId);

router.use(checkAuth);

router.post(
  "/",
  [
    check("title").isLength({ min: 5 }),
    check("description").not().isEmpty(),
    check("lead").not().isEmpty(),
  ],
  projectsController.addProject
);

router.patch(
  "/:pid",
  [check("lead").not().isEmpty(), check("description").isLength({ min: 5 })],
  projectsController.updateProject
);

router.delete("/:pid", projectsController.deleteProject);

module.exports = router;
