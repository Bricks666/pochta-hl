const { UsersService } = require("../services");

module.exports = class UsersController {
	static async getUsers(req, res, next) {
		try {
			const { user } = req.body;
			const users = await UsersService.getUsers(user.login);
			res.json({ users });
		} catch (e) {
			next(e);
		}
	}
	static async getMe(req, res, next) {
		try {
			const { user } = req.body;
			const me = await UsersService.getUser(user.login, user.login);
			res.json({ me });
		} catch (e) {
			next(e);
		}
	}
	static async upgradeToPostman(req, res, next) {
		try {
			const { user, mailId } = req.body;
			const { login } = req.params;
			await UsersService.upgradeToPostman(user.login, login, mailId);
			res.json({ login });
		} catch (e) {
			next(e);
		}
	}
	static async upgradeToAdmin(req, res, next) {
		try {
			const { user } = req.body;
			const { login } = req.params;
			await UsersService.upgradeToAdmin(user.login, login);
			res.json({ login });
		} catch (e) {
			next(e);
		}
	}
	static async changeInfo(req, res, next) {
		try {
			const { user, name, address } = req.body;
			const info = await UsersService.changeInfo(user.login, name, address);
			res.json({ info });
		} catch (e) {
			next(e);
		}
	}
	static async deletePostman(req, res, next) {
		try {
			const { user } = req.body;
			const { login } = req.params;
			const postman = await UsersService.deletePostman(user.login, login);
			res.json({ login });
		} catch (e) {
			next(e);
		}
	}
};
