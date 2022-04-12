const AuthService = require("../services/auth");
const Fabric = require("../services/fabric");

module.exports = class AuthControllers {
	static async login(req, res, next) {
		try {
			const { login } = req.body;
			const user = await AuthService.login(login, "org1");
			res.json({ user });
		} catch (e) {
			next(e);
		}
	}
	static async registration(req, res, next) {
		try {
			const { login, name, address } = req.body;
      await Fabric.registerIdentity(login)
      await AuthService.registration(login, name, address)
		} catch (e) {
      next(e)
    }
	}
};
