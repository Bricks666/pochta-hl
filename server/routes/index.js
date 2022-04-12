const { Router } = require("express");
const authRoutes = require("./auth");
const mailsRoutes = require("./mails");
const transfersRoutes = require("./transfers");
const usersRoutes = require("./users");

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", usersRoutes);
routes.use("/transfers", transfersRoutes);
routes.use("/mails", mailsRoutes);

module.exports.routes = routes;
