const express = require("express");
const controller = require("../controllers/user.controller");
const authorize = require("../middleware/check_auth");
const upload = require("../middleware/upload");

const routes = express.Router();

routes.post("/create-new-user", controller.createNewUser);
routes.post("/login", controller.loginUser);
routes.get("/user-details", authorize, controller.getTheUserAccountDetails);
routes.put("/get-membership", authorize, controller.getMemberShip);
routes.put(
  "/upload/profileimage",
  authorize,
  upload.single("imageUrl"),
  controller.uploadProfileImage
);

module.exports = routes;
