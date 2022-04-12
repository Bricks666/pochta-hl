const { Router } = require("express");
const { ROLES } = require("../configs");
const MailsController = require("../controllers/mails");
const { roleAccess } = require("../middlewares");

const routes = Router();

routes.get("/", MailsController.getMails);
routes.put("/add", roleAccess(ROLES.POSTMAN), MailsController.addMail);
routes.post("/:id/pay", MailsController.payMail);
routes.post("/:id/accept", MailsController.acceptMail);
routes.post("/:id/cancel", MailsController.cancelMail);

module.exports = routes;
