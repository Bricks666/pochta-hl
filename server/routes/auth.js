const { Router } = require("express");
const { AuthController } = require("../controllers");

const routes = Router();

routes.post("/login", AuthController.login);
routes.put("/registration", AuthController.registration);

module.exports = routes;
