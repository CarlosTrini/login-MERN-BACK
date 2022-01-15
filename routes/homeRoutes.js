const router = require("express").Router();
const homeController = require("../controllers/homeController");
const {validateToken} = require("../middlewares/validateToken");

router.get("/", validateToken, homeController.home);

module.exports = router;
