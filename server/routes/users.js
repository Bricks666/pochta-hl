const { Router } = require("express");
const { ROLES } = require("../configs");
const { UsersController } = require("../controllers");
const { roleAccess } = require("../middlewares");

const routes = Router();

routes.get("/", UsersController.getUsers);
routes.get("/me", UsersController.getMe);
routes.post("/me/change", UsersController.changeInfo);
routes.post(
	"/:login/postman",
	roleAccess(ROLES.ADMIN),
	UsersController.upgradeToPostman
);
routes.post(
	"/:login/admin",
	roleAccess(ROLES.MAIN_ADMIN),
	UsersController.upgradeToAdmin
);
routes.delete(
	"/:login/postman",
	roleAccess(ROLES.MAIN_ADMIN),
	UsersController.deletePostman
);

module.exports = routes;
