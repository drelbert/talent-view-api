var express = require("express");
var { check } = require("express-validator");

var router = express.Router();

var usersController = require("../controllers/users-controllers");
var fileUpload = require("../middleware/file-upload");
// middleware
router.get("/", usersController.getUsers);

router.get("/:uid", usersController.getUserById);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

router.patch("/:uid", usersController.updateUser);

router.delete("/:uid", usersController.deleteUser);

module.exports = router;
