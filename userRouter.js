const express = require("express");
const {
  updateUser,
  getUser,
  deleteUser,
} = require("./controller/userController");
const router = express.Router();

router.route("/:email").get(getUser).patch(updateUser).delete(deleteUser);
module.exports = router;
